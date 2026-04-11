import generate from '../src/generate.js';
import { Template, BLANK_PDF, Schema } from '@pdfme/common';
import { PDFDocument, PDFName, PDFArray, PDFDict, PDFStream, PDFBool } from '@pdfme/pdf-lib';
import { getFont, getImageSnapshotOptions, pdfToImages } from './utils.js';

describe('generate integrate test', () => {
  describe('basic generator', () => {
    const textObject = (x: number, y: number, name: string = 'a'): Schema => ({
      name,
      type: 'text',
      content: '',
      position: { x, y },
      width: 100,
      height: 100,
      fontSize: 13,
    });

    const singleSchemaTemplate: Template = {
      basePdf: BLANK_PDF,
      schemas: [[textObject(0, 0), textObject(25, 25, 'b')]],
    };

    const multiSchemasTemplate: Template = {
      basePdf:
        'data:application/pdf;base64,JVBERi0xLjcNJeLjz9MNCjYgMCBvYmoNPDwvTGluZWFyaXplZCAxL0wgMTg0NC9PIDgvRSAxMTEwL04gMi9UIDE1NzAvSCBbIDQyMyAxMzFdPj4NZW5kb2JqDSAgICAgICAgICAgICAgICAgICAgICAgDQoxMSAwIG9iag08PC9EZWNvZGVQYXJtczw8L0NvbHVtbnMgMy9QcmVkaWN0b3IgMTI+Pi9GaWx0ZXIvRmxhdGVEZWNvZGUvSURbPEJBMTk5MUY0MThCN0IyMTEwQTAwNjc0NThCNkJDNjIzPjxGOEE4OEZEMzMzNjQ2OTQ2QkE1ODMzM0M4MEFEMDFFNj5dL0luZGV4WzYgN10vTGVuZ3RoIDM2L1ByZXYgMTU3MS9Sb290IDcgMCBSL1NpemUgMTMvVHlwZS9YUmVmL1dbMSAyIDBdPj5zdHJlYW0NCmjeYmJkEGBiYJJiYmDQZWJgvA+k45gY/j4Aso0BAgwAISQDuA0KZW5kc3RyZWFtDWVuZG9iag1zdGFydHhyZWYNCjANCiUlRU9GDQogICAgICAgIA0KMTIgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA1Ny9TIDQ0Pj5zdHJlYW0NCmjeYmBgYGJgYLzCwAgkbRk4GBCAAyjGxMDCwNFwiOGAQvkhJCkGZihmYIhj4GhkSGEACDAAvy4F4g0KZW5kc3RyZWFtDWVuZG9iag03IDAgb2JqDTw8L1BhZ2VzIDUgMCBSL1R5cGUvQ2F0YWxvZz4+DWVuZG9iag04IDAgb2JqDTw8L0Fubm90c1tdL0JsZWVkQm94WzAgMCA1OTUuNDQgODQxLjkyXS9Db250ZW50cyA5IDAgUi9Dcm9wQm94WzAgMCA1OTUuNDQgODQxLjkyXS9NZWRpYUJveFswIDAgNTk1LjQ0IDg0MS45Ml0vUGFyZW50IDUgMCBSL1Jlc291cmNlczw8L1hPYmplY3Q8PC9GbTAgMTAgMCBSPj4+Pi9Sb3RhdGUgMC9UcmltQm94WzAgMCA1OTUuNDQgODQxLjkyXS9UeXBlL1BhZ2U+Pg1lbmRvYmoNOSAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDI2Pj5zdHJlYW0NCkiJKlQwUAjx0XfLNVBwyVcIVAAIMAAiagP4DQplbmRzdHJlYW0NZW5kb2JqDTEwIDAgb2JqDTw8L0JCb3hbMzI3NjguMCAzMjc2OC4wIC0zMjc2OC4wIC0zMjc2OC4wXS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTQvTWF0cml4WzEgMCAwIDEgMCAwXS9SZXNvdXJjZXM8PD4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIkq5ArkAggwAAKSANcNCmVuZHN0cmVhbQ1lbmRvYmoNMSAwIG9iag08PC9Bbm5vdHNbXS9CbGVlZEJveFswIDAgNTk1LjQ0IDg0MS45Ml0vQ29udGVudHMgMiAwIFIvQ3JvcEJveFswIDAgNTk1LjQ0IDg0MS45Ml0vTWVkaWFCb3hbMCAwIDU5NS40NCA4NDEuOTJdL1BhcmVudCA1IDAgUi9SZXNvdXJjZXM8PC9YT2JqZWN0PDwvRm0wIDEwIDAgUj4+Pj4vUm90YXRlIDAvVHJpbUJveFswIDAgNTk1LjQ0IDg0MS45Ml0vVHlwZS9QYWdlPj4NZW5kb2JqDTIgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAyNj4+c3RyZWFtDQpIiSpUMFAI8dF3yzVQcMlXCFQACDAAImoD+A0KZW5kc3RyZWFtDWVuZG9iag0zIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9GaXJzdCA0L0xlbmd0aCA1Mi9OIDEvVHlwZS9PYmpTdG0+PnN0cmVhbQ0KaN4yVTBQsLHRd84vzStRMNL3zkwpjrYAigUpGILIWP2QyoJU/YDE9NRiOzuAAAMAETgMkw0KZW5kc3RyZWFtDWVuZG9iag00IDAgb2JqDTw8L0RlY29kZVBhcm1zPDwvQ29sdW1ucyAzL1ByZWRpY3RvciAxMj4+L0ZpbHRlci9GbGF0ZURlY29kZS9JRFs8QkExOTkxRjQxOEI3QjIxMTBBMDA2NzQ1OEI2QkM2MjM+PEY4QTg4RkQzMzM2NDY5NDZCQTU4MzMzQzgwQUQwMUU2Pl0vTGVuZ3RoIDMzL1Jvb3QgNyAwIFIvU2l6ZSA2L1R5cGUvWFJlZi9XWzEgMiAwXT4+c3RyZWFtDQpo3mJiYGBgYmQJY2JgvM/EwBAHpCcwMf56ABBgABstBBINCmVuZHN0cmVhbQ1lbmRvYmoNc3RhcnR4cmVmDQoxMTYNCiUlRU9GDQo=',
      schemas: [[textObject(0, 0)], [textObject(25, 25, 'b')]],
    };

    const singleInputs = [{ a: 'a', b: 'b' }];
    const multiInputs = [
      { a: 'a-1', b: 'b-1' },
      { a: 'a-2', b: 'b-2' },
    ];

    const testCases = [
      {
        template: singleSchemaTemplate,
        inputs: singleInputs,
        testName: 'singleSchemaTemplate with singleInputs',
      },
      {
        template: singleSchemaTemplate,
        inputs: multiInputs,
        testName: 'singleSchemaTemplate with multiInputs',
      },
      {
        template: multiSchemasTemplate,
        inputs: singleInputs,
        testName: 'multiSchemasTemplate with singleInputs',
      },
      {
        template: multiSchemasTemplate,
        inputs: multiInputs,
        testName: 'multiSchemasTemplate with multiInputs',
      },
    ];

    // testCases for
    for (let i = 0; i < testCases.length; i += 1) {
      const { template, inputs, testName } = testCases[i];
      test(testName, async () => {
        const pdf = await generate({ inputs, template });
        const images = await pdfToImages(pdf);
        for (let i = 0; i < images.length; i++) {
          await expect(images[i]).toMatchImage(getImageSnapshotOptions(`${testName}-${i + 1}`));
        }
      });
    }
  });

  describe('use fontColor template', () => {
    test(`sample`, async () => {
      const inputs = [{ name: 'here is purple color' }];
      const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
          [
            {
              name: 'name',
              type: 'text',
              content: '',
              position: { x: 30, y: 30 },
              width: 100,
              height: 20,
              fontColor: '#7d2ae8',
            },
          ],
        ],
      };
      const pdf = await generate({ inputs, template });
      const images = await pdfToImages(pdf);
      for (let i = 0; i < images.length; i++) {
        await expect(images[i]).toMatchImage(getImageSnapshotOptions(`fontColor-${i + 1}`));
      }
    });
  });

  describe('use fontSubset template', () => {
    test(`sample`, async () => {
      const inputs = [{ field1: 'NotoSansJP', field2: 'NotoSerifJP' }];
      const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
          [
            {
              name: 'field1',
              type: 'text',
              content: '',
              position: { x: 30, y: 30 },
              width: 100,
              height: 20,
              fontName: 'NotoSansJP',
            },
            {
              name: 'field2',
              type: 'text',
              content: '',
              position: { x: 60, y: 60 },
              width: 100,
              height: 20,
              fontName: 'NotoSerifJP',
            },
          ],
        ],
      };
      const font = getFont();
      const pdf = await generate({
        inputs,
        template,
        options: {
          font: {
            NotoSansJP: {
              ...font.NotoSansJP,
              fallback: true,
              subset: false,
            },
            NotoSerifJP: {
              ...font.NotoSerifJP,
              subset: false,
            },
          },
        },
      });
      const images = await pdfToImages(pdf);
      for (let i = 0; i < images.length; i++) {
        await expect(images[i]).toMatchImage(getImageSnapshotOptions(`fontSubset-${i + 1}`));
      }
    }, 10000);
  });
});

describe('check validation', () => {
  test(`inputs length is 0`, async () => {
    const inputs: { [key: string]: string }[] = [];
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'a',
            type: 'text',
            content: '',
            position: { x: 0, y: 0 },
            width: 100,
            height: 100,
          },
        ],
      ],
    };
    try {
      await generate({ inputs, template, options: { font: getFont() } });
      fail();
    } catch (e: any) {
      expect(e.message).toEqual(`[@pdfme/common] Invalid argument:
--------------------------
ERROR POSITION: inputs
ERROR MESSAGE: Too small: expected array to have >=1 items
--------------------------`);
    }
  });
  test(`missing fallback font`, async () => {
    const inputs = [{ a: 'test' }];
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'a',
            type: 'text',
            content: '',
            position: { x: 0, y: 0 },
            width: 100,
            height: 100,
          },
        ],
      ],
    };
    const font = getFont();
    font.Roboto.fallback = false;
    try {
      await generate({ inputs, template, options: { font } });
      fail();
    } catch (e: any) {
      expect(e.message).toEqual(
        `[@pdfme/common] fallback flag is not found in font. true fallback flag must be only one.
Check this document: https://pdfme.com/docs/custom-fonts#about-font-type`
      );
    }
  });
  test(`too many fallback font`, async () => {
    const inputs = [{ a: 'test' }];
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'a',
            type: 'text',
            content: '',
            position: { x: 0, y: 0 },
            width: 100,
            height: 100,
          },
        ],
      ],
    };
    const font = getFont();
    // Set multiple fonts to have fallback = true to test the error
    font.Roboto.fallback = true;
    font.NotoSansJP = { ...font.NotoSansJP, fallback: true };
    try {
      await generate({ inputs, template, options: { font } });
      fail();
    } catch (e: any) {
      expect(e.message).toEqual(
        `[@pdfme/common] 2 fallback flags found in font. true fallback flag must be only one.
Check this document: https://pdfme.com/docs/custom-fonts#about-font-type`
      );
    }
  });
  test(`missing font in template.schemas`, async () => {
    const inputs = [{ a: 'test' }];
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'a',
            type: 'text',
            content: '',
            fontName: 'DUMMY_FONT',
            position: { x: 0, y: 0 },
            width: 100,
            height: 100,
          },
          {
            name: 'b',
            type: 'text',
            content: '',
            position: { x: 0, y: 0 },
            width: 100,
            height: 100,
          },
        ],
      ],
    };
    try {
      await generate({ inputs, template, options: { font: getFont() } });
      fail();
    } catch (e: any) {
      expect(e.message).toEqual(
        `[@pdfme/common] DUMMY_FONT of template.schemas is not found in font.
Check this document: https://pdfme.com/docs/custom-fonts`
      );
    }
  });

  describe('PDF/VT support (pdfvtOptions)', () => {
    const textSchema = (name: string): Schema => ({
      name,
      type: 'text',
      content: '',
      position: { x: 10, y: 10 },
      width: 100,
      height: 20,
    });

    const pdfvtTemplate: Template = {
      basePdf: BLANK_PDF,
      schemas: [[textSchema('name')]],
      pdfvtOptions: {
        version: 'PDF/VT-1',
        mapping: { RecordID: 'id' },
      },
    } as Template;

    test('generates PDF with DPartRoot when pdfvtOptions is present', async () => {
      const inputs = [{ id: 'rec-1', name: 'Alice' }, { id: 'rec-2', name: 'Bob' }];
      const pdf = await generate({ inputs, template: pdfvtTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      // DPartRoot must exist
      const dpartRoot = catalog.get(PDFName.of('DPartRoot'));
      expect(dpartRoot).toBeDefined();
    });

    test('generates PDF with XMP metadata when pdfvtOptions is present', async () => {
      const inputs = [{ id: 'rec-1', name: 'Alice' }];
      const pdf = await generate({ inputs, template: pdfvtTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      // Metadata stream must exist on catalog
      const metadataRef = catalog.get(PDFName.of('Metadata'));
      expect(metadataRef).toBeDefined();
    });

    test('generates PDF with OutputIntent when pdfvtOptions is present', async () => {
      const inputs = [{ id: 'rec-1', name: 'Alice' }];
      const pdf = await generate({ inputs, template: pdfvtTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      // OutputIntents array must exist
      const outputIntents = catalog.lookupMaybe(PDFName.of('OutputIntents'), PDFArray);
      expect(outputIntents).toBeDefined();
      expect(outputIntents!.size()).toBeGreaterThanOrEqual(1);
    });

    test('generates PDF with custom OutputIntent when specified', async () => {
      const templateWithIntent: Template = {
        ...pdfvtTemplate,
        pdfvtOptions: {
          ...((pdfvtTemplate as any).pdfvtOptions),
          outputIntent: {
            profileName: 'GRACoL2006_Coated1v2',
            registryName: 'http://www.color.org',
            info: 'GRACoL 2006 Coated',
          },
        },
      } as Template;

      const inputs = [{ id: 'rec-1', name: 'Alice' }];
      const pdf = await generate({ inputs, template: templateWithIntent, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      const outputIntents = catalog.lookupMaybe(PDFName.of('OutputIntents'), PDFArray);
      expect(outputIntents).toBeDefined();

      const intent = outputIntents!.lookup(0, PDFDict);
      expect(intent.get(PDFName.of('S'))).toBe(PDFName.of('GTS_PDFX'));
    });

    test('generates normal PDF without DPart when pdfvtOptions is absent', async () => {
      const normalTemplate: Template = {
        basePdf: BLANK_PDF,
        schemas: [[textSchema('name')]],
      };
      const inputs = [{ name: 'Alice' }];
      const pdf = await generate({ inputs, template: normalTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      // No DPartRoot, no OutputIntents
      expect(catalog.get(PDFName.of('DPartRoot'))).toBeUndefined();
      expect(catalog.lookupMaybe(PDFName.of('OutputIntents'), PDFArray)).toBeUndefined();
    });

    test('generates normal PDF when pdfvtOptions is absent', async () => {
      const normalTemplate: Template = {
        basePdf: BLANK_PDF,
        schemas: [[textSchema('name')]],
      } as Template;
      const inputs = [{ id: 'rec-1', name: 'Alice' }];
      const pdf = await generate({ inputs, template: normalTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const catalog = pdfDoc.catalog;

      expect(catalog.get(PDFName.of('DPartRoot'))).toBeUndefined();
    });

    test('creates per-record DPart nodes with metadata', async () => {
      const inputs = [
        { id: 'rec-1', name: 'Alice' },
        { id: 'rec-2', name: 'Bob' },
        { id: 'rec-3', name: 'Carol' },
      ];
      const pdf = await generate({ inputs, template: pdfvtTemplate, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);

      // Should have 3 pages (one per record)
      expect(pdfDoc.getPageCount()).toBe(3);

      // DPartRoot should exist with children
      const catalog = pdfDoc.catalog;
      const dpartRoot = catalog.get(PDFName.of('DPartRoot'));
      expect(dpartRoot).toBeDefined();
    });

    test('tags embedded page Form XObjects with GTS_PDFVTCached when using customPdf', async () => {
      // Create a small custom PDF to use as basePdf (must draw something so Contents exists)
      const basePdfDoc = await PDFDocument.create();
      const page = basePdfDoc.addPage([200, 200]);
      page.setTrimBox(10, 10, 180, 180);
      page.drawRectangle({ x: 0, y: 0, width: 1, height: 1 });
      const basePdfBytes = await basePdfDoc.save();
      const basePdfBase64 = 'data:application/pdf;base64,' + Buffer.from(basePdfBytes).toString('base64');

      const template: Template = {
        basePdf: basePdfBase64,
        schemas: [[textSchema('name')]],
        pdfvtOptions: {
          version: 'PDF/VT-1',
          mapping: { RecordID: 'id' },
        },
      } as Template;

      const inputs = [{ id: 'rec-1', name: 'Alice' }, { id: 'rec-2', name: 'Bob' }];
      const pdf = await generate({ inputs, template, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);

      // Find Form XObjects (embedded pages) in the output and verify GTS_PDFVTCached
      const pages = pdfDoc.getPages();
      let foundCachedXObject = false;

      for (const p of pages) {
        const resources = p.node.get(PDFName.of('Resources'));
        if (!resources) continue;
        const resourcesDict = pdfDoc.context.lookup(resources, PDFDict);
        const xObjects = resourcesDict.get(PDFName.of('XObject'));
        if (!xObjects) continue;
        const xObjectsDict = pdfDoc.context.lookup(xObjects, PDFDict);

        for (const [, ref] of xObjectsDict.entries()) {
          const obj = pdfDoc.context.lookup(ref);
          if (obj instanceof PDFStream) {
            const subtype = obj.dict.get(PDFName.of('Subtype'));
            if (subtype === PDFName.of('Form')) {
              const cached = obj.dict.get(PDFName.of('GTS_PDFVTCached'));
              if (cached === PDFBool.True) {
                foundCachedXObject = true;
              }
            }
          }
        }
      }

      expect(foundCachedXObject).toBe(true);
    });

    test('does not tag Form XObjects with GTS_PDFVTCached when pdfvtOptions is absent', async () => {
      const basePdfDoc = await PDFDocument.create();
      const p = basePdfDoc.addPage([200, 200]);
      p.drawRectangle({ x: 0, y: 0, width: 1, height: 1 });
      const basePdfBytes = await basePdfDoc.save();
      const basePdfBase64 = 'data:application/pdf;base64,' + Buffer.from(basePdfBytes).toString('base64');

      const template: Template = {
        basePdf: basePdfBase64,
        schemas: [[textSchema('name')]],
      };

      const inputs = [{ name: 'Alice' }];
      const pdf = await generate({ inputs, template, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const pages = pdfDoc.getPages();

      for (const p of pages) {
        const resources = p.node.get(PDFName.of('Resources'));
        if (!resources) continue;
        const resourcesDict = pdfDoc.context.lookup(resources, PDFDict);
        const xObjects = resourcesDict.get(PDFName.of('XObject'));
        if (!xObjects) continue;
        const xObjectsDict = pdfDoc.context.lookup(xObjects, PDFDict);

        for (const [, ref] of xObjectsDict.entries()) {
          const obj = pdfDoc.context.lookup(ref);
          if (obj instanceof PDFStream) {
            const cached = obj.dict.get(PDFName.of('GTS_PDFVTCached'));
            expect(cached).toBeUndefined();
          }
        }
      }
    });
  });

  describe('customPdf box propagation', () => {
    const textSchema = (name: string): Schema => ({
      name,
      type: 'text',
      content: '',
      position: { x: 10, y: 10 },
      width: 50,
      height: 20,
    });

    test('propagates ArtBox from customPdf to output pages', async () => {
      const basePdfDoc = await PDFDocument.create();
      const page = basePdfDoc.addPage([300, 400]);
      page.setMediaBox(0, 0, 300, 400);
      page.setBleedBox(5, 5, 290, 390);
      page.setTrimBox(10, 10, 280, 380);
      page.setArtBox(20, 20, 260, 360);
      page.drawRectangle({ x: 0, y: 0, width: 1, height: 1 });
      const basePdfBytes = await basePdfDoc.save();
      const basePdfBase64 = 'data:application/pdf;base64,' + Buffer.from(basePdfBytes).toString('base64');

      const template: Template = {
        basePdf: basePdfBase64,
        schemas: [[textSchema('name')]],
      };

      const inputs = [{ name: 'Alice' }];
      const pdf = await generate({ inputs, template, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const outputPage = pdfDoc.getPage(0);

      const artBox = outputPage.getArtBox();
      expect(artBox.x).toBeCloseTo(20, 0);
      expect(artBox.y).toBeCloseTo(20, 0);
      expect(artBox.width).toBeCloseTo(260, 0);
      expect(artBox.height).toBeCloseTo(360, 0);
    });

    test('propagates all page boxes from customPdf to output pages', async () => {
      const basePdfDoc = await PDFDocument.create();
      const page = basePdfDoc.addPage([300, 400]);
      page.setMediaBox(0, 0, 300, 400);
      page.setBleedBox(3, 3, 294, 394);
      page.setTrimBox(10, 10, 280, 380);
      page.setArtBox(15, 15, 270, 370);
      page.drawRectangle({ x: 0, y: 0, width: 1, height: 1 });
      const basePdfBytes = await basePdfDoc.save();
      const basePdfBase64 = 'data:application/pdf;base64,' + Buffer.from(basePdfBytes).toString('base64');

      const template: Template = {
        basePdf: basePdfBase64,
        schemas: [[textSchema('field')]],
      };

      const inputs = [{ field: 'test' }];
      const pdf = await generate({ inputs, template, options: { font: getFont() } });

      const pdfDoc = await PDFDocument.load(pdf);
      const outputPage = pdfDoc.getPage(0);

      const mediaBox = outputPage.getMediaBox();
      expect(mediaBox.x).toBeCloseTo(0, 0);
      expect(mediaBox.y).toBeCloseTo(0, 0);
      expect(mediaBox.width).toBeCloseTo(300, 0);
      expect(mediaBox.height).toBeCloseTo(400, 0);

      const bleedBox = outputPage.getBleedBox();
      expect(bleedBox.x).toBeCloseTo(3, 0);
      expect(bleedBox.y).toBeCloseTo(3, 0);
      expect(bleedBox.width).toBeCloseTo(294, 0);
      expect(bleedBox.height).toBeCloseTo(394, 0);

      const trimBox = outputPage.getTrimBox();
      expect(trimBox.x).toBeCloseTo(10, 0);
      expect(trimBox.y).toBeCloseTo(10, 0);
      expect(trimBox.width).toBeCloseTo(280, 0);
      expect(trimBox.height).toBeCloseTo(380, 0);

      const artBox = outputPage.getArtBox();
      expect(artBox.x).toBeCloseTo(15, 0);
      expect(artBox.y).toBeCloseTo(15, 0);
      expect(artBox.width).toBeCloseTo(270, 0);
      expect(artBox.height).toBeCloseTo(370, 0);
    });
  });
});
