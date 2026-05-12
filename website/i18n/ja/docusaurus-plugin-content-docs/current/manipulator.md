# ãƒžãƒ‹ãƒ”ãƒ¥ãƒ¬ãƒ¼ã‚¿ãƒ¼

`@weberon/manipulator`ãƒ‘ãƒƒã‚±ãƒ¼ã‚¸ã¯PDFãƒ•ã‚¡ã‚¤ãƒ«ã‚’æ“ä½œã™ã‚‹ãŸã‚ã®å¼·åŠ›ãªãƒ¦ãƒ¼ãƒ†ã‚£ãƒªãƒ†ã‚£ã‚’æä¾›ã—ã¾ã™ã€‚Node.jsã¨ãƒ–ãƒ©ã‚¦ã‚¶ç’°å¢ƒã®ä¸¡æ–¹ã§ä½¿ç”¨ã§ãã¾ã™ã€‚

## ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«

```bash
npm install @weberon/manipulator
```

## æ©Ÿèƒ½

### mergeï¼ˆçµåˆï¼‰
è¤‡æ•°ã®PDFãƒ•ã‚¡ã‚¤ãƒ«ã‚’1ã¤ã®PDFã«çµåˆã—ã¾ã™ã€‚

```ts
import { merge } from '@weberon/manipulator';

const pdf1 = new ArrayBuffer(...); // 1ã¤ç›®ã®PDF
const pdf2 = new ArrayBuffer(...); // 2ã¤ç›®ã®PDF
const merged = await merge([pdf1, pdf2]);
```

### splitï¼ˆåˆ†å‰²ï¼‰
PDFã‚’ãƒšãƒ¼ã‚¸ç¯„å›²ã«åŸºã¥ã„ã¦è¤‡æ•°ã®PDFã«åˆ†å‰²ã—ã¾ã™ã€‚

```ts
import { split } from '@weberon/manipulator';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const splits = await split(pdf, [
  { start: 0, end: 1 }, // 1-2ãƒšãƒ¼ã‚¸
  { start: 2, end: 4 }, // 3-5ãƒšãƒ¼ã‚¸
]);
```

### rotateï¼ˆå›žè»¢ï¼‰
PDFã®æŒ‡å®šã•ã‚ŒãŸãƒšãƒ¼ã‚¸ã‚’å›žè»¢ã•ã›ã¾ã™ã€‚

```ts
import { rotate } from '@weberon/manipulator';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const result = await rotate(pdf, 90); // ã™ã¹ã¦ã®ãƒšãƒ¼ã‚¸ã‚’90åº¦å›žè»¢
// ã¾ãŸã¯ç‰¹å®šã®ãƒšãƒ¼ã‚¸ã‚’å›žè»¢ï¼š
const result2 = await rotate(pdf, 90, [0, 2]); // 1ãƒšãƒ¼ã‚¸ç›®ã¨3ãƒšãƒ¼ã‚¸ç›®ã‚’å›žè»¢
```

### insertï¼ˆæŒ¿å…¥ï¼‰
æŒ‡å®šã•ã‚ŒãŸä½ç½®ã«PDFãƒšãƒ¼ã‚¸ã‚’æŒ¿å…¥ã—ã¾ã™ã€‚

```ts
import { insert } from '@weberon/manipulator';

const basePdf = new ArrayBuffer(...); // ãƒ™ãƒ¼ã‚¹PDF
const insertPdf = new ArrayBuffer(...); // æŒ¿å…¥ã™ã‚‹PDF
const result = await insert(basePdf, [
  { pdf: insertPdf, position: 1 } // 1ãƒšãƒ¼ã‚¸ç›®ã®å¾Œã«æŒ¿å…¥
]);
```

### removeï¼ˆå‰Šé™¤ï¼‰
PDFã‹ã‚‰æŒ‡å®šã•ã‚ŒãŸãƒšãƒ¼ã‚¸ã‚’å‰Šé™¤ã—ã¾ã™ã€‚

```ts
import { remove } from '@weberon/manipulator';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const result = await remove(pdf, [1, 3]); // 2ãƒšãƒ¼ã‚¸ç›®ã¨4ãƒšãƒ¼ã‚¸ç›®ã‚’å‰Šé™¤
```

### moveï¼ˆç§»å‹•ï¼‰
PDFã®ä¸­ã§1ã¤ã®ãƒšãƒ¼ã‚¸ã‚’åˆ¥ã®ä½ç½®ã«ç§»å‹•ã—ã¾ã™ã€‚

```ts
import { move } from '@weberon/manipulator';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const result = await move(pdf, { from: 0, to: 2 }); // 1ãƒšãƒ¼ã‚¸ç›®ã‚’3ç•ªç›®ã®ä½ç½®ã«ç§»å‹•
```

### organizeï¼ˆæ•´ç†ï¼‰
è¤‡æ•°ã®PDFæ“ä½œã‚’é †ç•ªã«å®Ÿè¡Œã—ã¾ã™ã€‚

```ts
import { organize } from '@weberon/manipulator';

const pdf = new ArrayBuffer(...); // ã‚½ãƒ¼ã‚¹PDF
const insertPdf = new ArrayBuffer(...); // æŒ¿å…¥ã™ã‚‹PDF
const result = await organize(pdf, [
  { type: 'remove', data: { position: 1 } },
  { type: 'insert', data: { pdf: insertPdf, position: 0 } },
  { type: 'rotate', data: { position: 0, degrees: 90 } },
]);
```

## ã‚¨ãƒ©ãƒ¼å‡¦ç†

ç„¡åŠ¹ãªãƒ‘ãƒ©ãƒ¡ãƒ¼ã‚¿ãŒæä¾›ã•ã‚ŒãŸå ´åˆã€ã™ã¹ã¦ã®é–¢æ•°ã¯èª¬æ˜Žçš„ãªã‚¨ãƒ©ãƒ¼ã‚’ã‚¹ãƒ­ãƒ¼ã—ã¾ã™ï¼š

- ç„¡åŠ¹ãªãƒšãƒ¼ã‚¸ç•ªå·: `[@weberon/manipulator] Invalid page number`
- ç„¡åŠ¹ãªå›žè»¢è§’åº¦: `[@weberon/manipulator] Rotation degrees must be a multiple of 90`
- ç„¡åŠ¹ãªä½ç½®: `[@weberon/manipulator] Invalid position`
- ç©ºã®å…¥åŠ›: `[@weberon/manipulator] At least one PDF is required`

## åž‹å®šç¾©

```ts
type PDFInput = ArrayBuffer;

interface PageRange {
  start?: number;
  end?: number;
}

interface InsertOperation {
  pdf: PDFInput;
  position: number;
}

type OrganizeAction =
  | { type: 'remove'; data: { position: number } }
  | { type: 'insert'; data: { pdf: PDFInput; position: number } }
  | { type: 'replace'; data: { pdf: PDFInput; position: number } }
  | { type: 'rotate'; data: { position: number; degrees: 0 | 90 | 180 | 270 | 360 } }
  | { type: 'move'; data: { from: number; to: number } };
```

## ãŠå•ã„åˆã‚ã›

`@weberon/manipulator`ã«é–¢ã™ã‚‹ã”è³ªå•ã‚„ã”ææ¡ˆãŒã‚ã‚Šã¾ã—ãŸã‚‰ã€ä»¥ä¸‹ã¾ã§ã”é€£çµ¡ãã ã•ã„ï¼š

- **Discord**: [https://discord.gg/xWPTJbmgNV](https://discord.gg/xWPTJbmgNV)
- **GitHub Issues**: [https://github.com/pdfme/pdfme/issues](https://github.com/pdfme/pdfme/issues)

