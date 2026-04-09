import {
  PDFContext,
  PDFDPart,
  PDFName,
  PDFArray,
} from '../../../src/index';

describe(`PDFDPart`, () => {
  it(`can be constructed with context`, () => {
    const context = PDFContext.create();
    const dpart = PDFDPart.withContext(context);

    expect(dpart).toBeInstanceOf(PDFDPart);
    expect(dpart.get(PDFName.of('Type'))).toBe(PDFName.of('DPart'));
  });

  it(`root node uses /DParts key for children`, () => {
    const context = PDFContext.create();
    const root = PDFDPart.withContext(context, undefined, true);
    const child = PDFDPart.withContext(context);

    root.addChild(child);

    const dparts = root.lookupMaybe(PDFName.of('DParts'), PDFArray);
    const children = root.lookupMaybe(PDFName.of('Children'), PDFArray);

    expect(dparts).toBeDefined();
    expect(children).toBeUndefined();
    expect(dparts!.size()).toBe(1);
  });

  it(`non-root node uses /Children key for children`, () => {
    const context = PDFContext.create();
    const node = PDFDPart.withContext(context, undefined, false);
    const child = PDFDPart.withContext(context);

    node.addChild(child);

    const dparts = node.lookupMaybe(PDFName.of('DParts'), PDFArray);
    const children = node.lookupMaybe(PDFName.of('Children'), PDFArray);

    expect(dparts).toBeUndefined();
    expect(children).toBeDefined();
    expect(children!.size()).toBe(1);
  });

  it(`can add multiple children`, () => {
    const context = PDFContext.create();
    const root = PDFDPart.withContext(context, undefined, true);

    root.addChild(PDFDPart.withContext(context));
    root.addChild(PDFDPart.withContext(context));
    root.addChild(PDFDPart.withContext(context));

    expect(root.Children()!.size()).toBe(3);
  });

  it(`can set metadata`, () => {
    const context = PDFContext.create();
    const dpart = PDFDPart.withContext(context);
    const metadataStream = context.stream('<xmp>test</xmp>', { Type: 'Metadata', Subtype: 'XML' });
    const metadataRef = context.register(metadataStream);

    dpart.set(PDFName.of('Metadata'), metadataRef);

    expect(dpart.get(PDFName.of('Metadata'))).toBe(metadataRef);
  });

  it(`can be constructed from a Map and context`, () => {
    const context = PDFContext.create();
    const dict = new Map();
    dict.set(PDFName.of('Type'), PDFName.of('DPart'));
    const dpart = PDFDPart.fromMapWithContext(dict, context);

    expect(dpart).toBeInstanceOf(PDFDPart);
    expect(dpart.get(PDFName.of('Type'))).toBe(PDFName.of('DPart'));
  });
});
