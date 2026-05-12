# ã‚³ãƒ³ãƒãƒ¼ã‚¿ãƒ¼

`@weberon/converter` ã¯ Node.js ã¨ãƒ–ãƒ©ã‚¦ã‚¶ã®ä¸¡æ–¹ã§ä½¿ç”¨ã§ãã¾ã™ã€‚

ãã®ä¸»ãªç›®çš„ã¯ã€PDFã‚’ä»–ã®å½¢å¼ï¼ˆç”»åƒãªã©ï¼‰ã«å¤‰æ›ã—ãŸã‚Šã€æ§˜ã€…ãªãƒ‡ãƒ¼ã‚¿å½¢å¼ï¼ˆMarkdownãªã©ï¼‰ã‚’PDFã«å¤‰æ›ã™ã‚‹ã“ã¨ã§ã™ã€‚

ã¾ã é–‹ç™ºä¸­ã§ã™ãŒã€ã™ã§ã«ä»¥ä¸‹ã®æ©Ÿèƒ½ã‚’ä½¿ç”¨ã™ã‚‹ã“ã¨ãŒã§ãã¾ã™ï¼š

- **PDFã‚’ç”»åƒã«å¤‰æ›**: [pdf2img](https://github.com/pdfme/pdfme/blob/main/packages/converter/src/pdf2img.ts)
- **å„ãƒšãƒ¼ã‚¸ã®å¹…ã¨é«˜ã•ã‚’å–å¾—**: [pdf2size](https://github.com/pdfme/pdfme/blob/main/packages/converter/src/pdf2size.ts)
- **ç”»åƒã‚’PDFã«å¤‰æ›**: [img2pdf](https://github.com/pdfme/pdfme/blob/main/packages/converter/src/img2pdf.ts)

è¨ˆç”»ã•ã‚Œã¦ã„ã‚‹å¤‰æ›æ©Ÿèƒ½ã«ã¯ä»¥ä¸‹ãŒå«ã¾ã‚Œã¾ã™ï¼š
- **Markdownã‹ã‚‰PDF**: `md2pdf`
- **PDFã‹ã‚‰Markdown**: `pdf2md`

## ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«

```bash
npm install @weberon/converter
```

Node.js ã§ `pdf2img` ã‚’ä½¿ã†ãŸã‚ã«è¿½åŠ ã® install ã¯ä¸è¦ã§ã™ã€‚`@weberon/converter` ã«ã¯å¿…è¦ãª Node å‘ã‘ canvas å®Ÿè£…ã¨ã—ã¦ `@napi-rs/canvas` ãŒã™ã§ã«å«ã¾ã‚Œã¦ã„ã¾ã™ã€‚

## æ©Ÿèƒ½

### pdf2img
PDFãƒšãƒ¼ã‚¸ã‚’ç”»åƒï¼ˆJPEGã¾ãŸã¯PNGå½¢å¼ï¼‰ã«å¤‰æ›ã—ã¾ã™ã€‚

```ts
import { pdf2img } from '@weberon/converter';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const images = await pdf2img(pdf, {
  imageType: 'png',
  scale: 1,
  range: { start: 0, end: 1 },
});
```

### pdf2size
PDFã®å„ãƒšãƒ¼ã‚¸ã®å¹…ã¨é«˜ã•ã‚’å–å¾—ã—ã¾ã™ã€‚

```ts
import { pdf2size } from '@weberon/converter';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const sizes = await pdf2size(pdf, {
  scale: 1, // ã‚¹ã‚±ãƒ¼ãƒ«ãƒ•ã‚¡ã‚¯ã‚¿ãƒ¼ï¼ˆãƒ‡ãƒ•ã‚©ãƒ«ãƒˆ: 1ï¼‰
});
// sizes: Array<{ width: number, height: number }>
```

### img2pdf
1ã¤ã¾ãŸã¯è¤‡æ•°ã®ç”»åƒï¼ˆJPEGã¾ãŸã¯PNGï¼‰ã‚’1ã¤ã®PDFãƒ•ã‚¡ã‚¤ãƒ«ã«å¤‰æ›ã—ã¾ã™ã€‚

```ts
import { img2pdf } from '@weberon/converter';

const image1 = new ArrayBuffer(...); // 1æžšç›®ã®ç”»åƒ
const image2 = new ArrayBuffer(...); // 2æžšç›®ã®ç”»åƒ
const pdf = await img2pdf([image1, image2], {
  scale: 1,
  imageType: 'jpeg',
  size: { width: 210, height: 297 },
  margin: [10, 10, 10, 10],
});
```

## ã‚¨ãƒ©ãƒ¼å‡¦ç†

ç„¡åŠ¹ãªãƒ‘ãƒ©ãƒ¡ãƒ¼ã‚¿ãŒæä¾›ã•ã‚ŒãŸå ´åˆã€ã™ã¹ã¦ã®é–¢æ•°ã¯èª¬æ˜Žçš„ãªã‚¨ãƒ©ãƒ¼ã‚’ã‚¹ãƒ­ãƒ¼ã—ã¾ã™ï¼š

- ç„¡åŠ¹ãªPDF: `[@weberon/converter] Invalid PDF`
- ç©ºã®PDF: `[@weberon/converter] The PDF file is empty`
- ç„¡åŠ¹ãªãƒšãƒ¼ã‚¸ç¯„å›²: `[@weberon/converter] Invalid page range`
- ç©ºã®ç”»åƒé…åˆ—: `[@weberon/converter] Input must be a non-empty array of image buffers`
- ç„¡åŠ¹ãªç”»åƒ: `[@weberon/converter] Failed to process image`

## åž‹å®šç¾©

```ts
type ImageType = 'jpeg' | 'png';

interface PageRange {
  start?: number;
  end?: number;
}

interface Pdf2ImgOptions {
  scale?: number;
  imageType?: ImageType;
  range?: PageRange;
}

interface Pdf2SizeOptions {
  scale?: number;
}

interface Img2PdfOptions {
  scale?: number;
  imageType?: ImageType;
  size?: { height: number, width: number }; // ãƒŸãƒªãƒ¡ãƒ¼ãƒˆãƒ«å˜ä½
  margin?: [number, number, number, number]; // ãƒŸãƒªãƒ¡ãƒ¼ãƒˆãƒ«å˜ä½ [ä¸Š, å³, ä¸‹, å·¦]
}
```

## ãŠå•ã„åˆã‚ã›

`@weberon/converter`ã«é–¢ã™ã‚‹ã”è³ªå•ã‚„ã”ææ¡ˆãŒã‚ã‚Šã¾ã—ãŸã‚‰ã€ä»¥ä¸‹ã¾ã§ã”é€£çµ¡ãã ã•ã„ï¼š

- **Discord**: [https://discord.gg/xWPTJbmgNV](https://discord.gg/xWPTJbmgNV)
- **GitHub Issues**: [https://github.com/pdfme/pdfme/issues](https://github.com/pdfme/pdfme/issues)

