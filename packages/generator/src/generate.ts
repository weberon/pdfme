import * as pdfLib from '@pdfme/pdf-lib';
const randomUUID = () => globalThis.crypto.randomUUID();
import type { GenerateProps, Schema, PDFRenderProps, Template } from '@pdfme/common';
import {
  checkGenerateProps,
  getDynamicTemplate,
  isBlankPdf,
  replacePlaceholders,
  pt2mm,
  cloneDeep,
} from '@pdfme/common';
import { getDynamicHeightsForTable } from '@pdfme/schemas/tables';
import {
  insertPage,
  preprocessing,
  postProcessing,
  getEmbedPdfPages,
  validateRequiredFields,
} from './helper.js';

const generate = async (props: GenerateProps): Promise<Uint8Array<ArrayBuffer>> => {
  checkGenerateProps(props);
  const { inputs, template: _template, options = {}, plugins: userPlugins = {} } = props;
  const template = cloneDeep(_template);

  const basePdf = template.basePdf;

  if (inputs.length === 0) {
    throw new Error(
      '[@pdfme/generator] inputs should not be empty, pass at least an empty object in the array',
    );
  }

  validateRequiredFields(template, inputs);

  const { pdfDoc, renderObj } = await preprocessing({ template, userPlugins });

  // PDF/VT-1 setup — only activates when template.pdfvtOptions is present.
  // Templates without pdfvtOptions produce normal PDFs with no DPart/XMP/OutputIntent.
  let dpartRoot: pdfLib.PDFDPart | undefined;
  const pdfvtOptions = template.pdfvtOptions;

  // Computed once; used in XMP and re-applied to Info dict after postProcessing.
  const vtTitle = (options as Record<string, unknown>).title as string | undefined
    || 'PDF/VT Document';

  if (pdfvtOptions) {
    dpartRoot = pdfDoc.catalog.getOrCreateDPart();

    // Stable document identity — required by PDF/X-4 XMP spec
    const docId = `uuid:${randomUUID()}`;
    const instanceId = `uuid:${randomUUID()}`;
    const title = vtTitle;

    const xmp = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:pdfvmeta="http://www.npes.org/pdfvt/ns/id/"
      xmlns:pdfvt="http://www.gts-1.com/namespace/pdfvt/"
      xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/">
      <pdfvt:version>${pdfvtOptions.version}</pdfvt:version>
      <pdfx:GTS_PDFXVersion>PDF/X-4</pdfx:GTS_PDFXVersion>
      <pdfx:GTS_PDFVTVersion>${pdfvtOptions.version}</pdfx:GTS_PDFVTVersion>
      <pdfvmeta:GTS_PDFVT>true</pdfvmeta:GTS_PDFVT>
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${title}</rdf:li></rdf:Alt></dc:title>
      <xmpMM:DocumentID>${docId}</xmpMM:DocumentID>
      <xmpMM:InstanceID>${instanceId}</xmpMM:InstanceID>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
    pdfDoc.setXMP(xmp);

    // Set Output Intent with standardized identifier
    const outputIntentConfig = pdfvtOptions.outputIntent || {
      profileName: 'FOGRA39',
      registryName: 'http://www.color.org',
      info: 'Coated FOGRA39 (ISO 12647-2:2004)',
    };

    pdfDoc.setOutputIntent({
      subtype: 'GTS_PDFX',
      outputCondition: outputIntentConfig.profileName,
      outputConditionIdentifier: outputIntentConfig.profileName.includes(' ')
        ? outputIntentConfig.profileName.replace(/\s+/g, '')
        : outputIntentConfig.profileName,
      registryName: outputIntentConfig.registryName,
      info: outputIntentConfig.info,
    });
  }

  const _cache = new Map<string, unknown>();

  // For customPdf (non-blank), embed pages once and reuse across all records.
  // This creates shared Form XObjects — each record's pages reference the same
  // XObject, which is the prerequisite for GTS_PDFVTCached to be meaningful.
  // BlankPdf pages are mutable PDFPage objects and must be created per-record.
  let sharedBasePages: (pdfLib.PDFEmbeddedPage | pdfLib.PDFPage)[] | undefined;
  let sharedEmbedPdfBoxes: { mediaBox: { x: number; y: number; width: number; height: number }; bleedBox: { x: number; y: number; width: number; height: number }; trimBox: { x: number; y: number; width: number; height: number }; artBox?: { x: number; y: number; width: number; height: number } }[] | undefined;

  if (!isBlankPdf(basePdf)) {
    const result = await getEmbedPdfPages({ template, pdfDoc });
    sharedBasePages = result.basePages;
    sharedEmbedPdfBoxes = result.embedPdfBoxes;

    // PDF/VT: Tag shared Form XObjects with GTS_PDFVTCached so
    // PDF/VT-aware RIPs can tile-cache the base page content.
    if (pdfvtOptions) {
      for (const basePage of sharedBasePages) {
        if (basePage instanceof pdfLib.PDFEmbeddedPage) {
          await basePage.embed();
          const xObject = pdfDoc.context.lookup(basePage.ref);
          if (xObject instanceof pdfLib.PDFStream) {
            xObject.dict.set(
              pdfLib.PDFName.of('GTS_PDFVTCached'),
              pdfLib.PDFBool.True,
            );
          }
        }
      }
    }
  }

  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    const pagesForInput: pdfLib.PDFPage[] = [];

    // Get the dynamic template with proper typing
    const dynamicTemplate: Template = await getDynamicTemplate({
      template,
      input,
      options,
      _cache,
      getDynamicHeights: (value, args) => {
        switch (args.schema.type) {
          case 'table':
            return getDynamicHeightsForTable(value, args);
          default:
            return Promise.resolve([args.schema.height]);
        }
      },
    });

    // Reuse shared embedded pages for customPdf; create fresh pages for BlankPdf.
    const { basePages, embedPdfBoxes } = sharedBasePages
      ? { basePages: sharedBasePages, embedPdfBoxes: sharedEmbedPdfBoxes! }
      : await getEmbedPdfPages({ template: dynamicTemplate, pdfDoc });

    const schemas = dynamicTemplate.schemas;
    // Create a type-safe array of schema names without using Set spread which requires downlevelIteration
    const schemaNameSet = new Set<string>();
    schemas.forEach((page: Schema[]) => {
      page.forEach((schema: Schema) => {
        if (schema.name) {
          schemaNameSet.add(schema.name);
        }
      });
    });
    const schemaNames = Array.from(schemaNameSet);

    for (let j = 0; j < basePages.length; j += 1) {
      const basePage = basePages[j];
      const embedPdfBox = embedPdfBoxes[j];

      const boundingBoxLeft =
        basePage instanceof pdfLib.PDFEmbeddedPage ? pt2mm(embedPdfBox.mediaBox.x) : 0;
      const boundingBoxBottom =
        basePage instanceof pdfLib.PDFEmbeddedPage ? pt2mm(embedPdfBox.mediaBox.y) : 0;

      const page = insertPage({ basePage, embedPdfBox, pdfDoc });
      pagesForInput.push(page);

      if (isBlankPdf(basePdf) && basePdf.staticSchema) {
        for (let k = 0; k < basePdf.staticSchema.length; k += 1) {
          const staticSchema = basePdf.staticSchema[k];
          const render = renderObj[staticSchema.type];
          if (!render) {
            continue;
          }
          const value = staticSchema.readOnly
            ? replacePlaceholders({
                content: staticSchema.content || '',
                variables: { ...input, totalPages: basePages.length, currentPage: j + 1 },
                schemas: schemas, // Use the properly typed schemas variable
              })
            : staticSchema.content || '';

          staticSchema.position = {
            x: staticSchema.position.x + boundingBoxLeft,
            y: staticSchema.position.y - boundingBoxBottom,
          };

          // Create properly typed render props for static schema
          const staticRenderProps: PDFRenderProps<Schema> = {
            value,
            schema: staticSchema,
            basePdf,
            pdfLib,
            pdfDoc,
            page,
            options,
            _cache,
          };
          await render(staticRenderProps);
        }
      }

      for (let l = 0; l < schemaNames.length; l += 1) {
        const name = schemaNames[l];
        const schemaPage = schemas[j] || [];
        const schema = schemaPage.find((s: Schema) => s.name == name);
        if (!schema) {
          continue;
        }

        const render = renderObj[schema.type];
        if (!render) {
          continue;
        }
        const value: string = schema.readOnly
          ? replacePlaceholders({
              content: schema.content || '',
              variables: { ...input, totalPages: basePages.length, currentPage: j + 1 },
              schemas: schemas, // Use the properly typed schemas variable
            })
          : ((input[name] || '') as string);

        schema.position = {
          x: schema.position.x + boundingBoxLeft,
          y: schema.position.y - boundingBoxBottom,
        };

        // Create properly typed render props
        const renderProps: PDFRenderProps<Schema> = {
          value,
          schema,
          basePdf,
          pdfLib,
          pdfDoc,
          page,
          options,
          _cache,
        };
        await render(renderProps);
      }
    }

    // PDF/VT: Create a DPart node for this input record.
    // Each node carries per-record XMP metadata derived from pdfvtOptions.mapping.
    // Mapping keys = DPart metadata names (print production spec: record identity,
    // presort grouping, finishing instructions). Mapping values = field names in the
    // input record. The generator looks up each value in the current input and writes
    // it into the DPart node's XMP under the corresponding key.
    if (dpartRoot && pdfvtOptions) {
      const dpartNode = pdfLib.PDFDPart.withContext(pdfDoc.context);

      const recordIdField = pdfvtOptions.mapping.RecordID;
      const recordId = recordIdField && input[recordIdField] ? String(input[recordIdField]) : `record-${i}`;

      const xmpMetadata = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:pdfvmeta="http://www.npes.org/pdfvt/ns/id/">
      <pdfvmeta:GTS_PDFVT>true</pdfvmeta:GTS_PDFVT>
      <pdfvmeta:RecordID>${recordId}</pdfvmeta:RecordID>`;

      let xmpContent = xmpMetadata;
      for (const [key, field] of Object.entries(pdfvtOptions.mapping) as [string, string][]) {
        if (key !== 'RecordID' && input[field]) {
          const value = String(input[field]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xmpContent += `\n      <pdfvmeta:${key}>${value}</pdfvmeta:${key}>`;
        }
      }

      xmpContent += `
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

      const xmpStream = pdfDoc.context.stream(xmpContent, { Type: 'Metadata', Subtype: 'XML' });
      const xmpStreamRef = pdfDoc.context.register(xmpStream);
      dpartNode.set(pdfLib.PDFName.of('Metadata'), xmpStreamRef);

      dpartRoot.addChild(dpartNode);
      for (const page of pagesForInput) {
        page.setDPart(dpartNode);
      }
    }
  }

  postProcessing({ pdfDoc, options });

  if (pdfvtOptions) {
    // Re-apply PDF/X-4 required Info dict fields after postProcessing
    pdfDoc.setTitle(vtTitle);
    // /Trapped /False — PDF/X-4 §4.2.1
    (pdfDoc as unknown as { getInfoDict(): pdfLib.PDFDict }).getInfoDict()
      .set(pdfLib.PDFName.of('Trapped'), pdfLib.PDFName.of('False'));

    const dpartRootEntry = pdfDoc.catalog.get(pdfLib.PDFName.of("DPartRoot")) || pdfDoc.catalog.get(pdfLib.PDFName.of("DPart"));
    if (dpartRootEntry) {
      pdfDoc.catalog.set(pdfLib.PDFName.of("DPartRoot"), dpartRootEntry);
    }
  }

  return pdfDoc.save();
};

export default generate;
