# ã‚«ã‚¹ã‚¿ãƒ ãƒ•ã‚©ãƒ³ãƒˆ

pdfmeã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã§[Roboto Regular 400](https://fonts.google.com/specimen/Roboto)ãƒ•ã‚©ãƒ³ãƒˆã‚’ä½¿ç”¨ã—ã¦ã„ã¾ã™ãŒã€ãŠå¥½ããªãƒ•ã‚©ãƒ³ãƒˆã‚’ä½¿ç”¨ã™ã‚‹ã“ã¨ãŒã§ãã¾ã™ã€‚

ãƒ‡ã‚¶ã‚¤ãƒ³ã‚’å„ªå…ˆã™ã‚‹å ´åˆã¯ã€ãŠæ°—ã«å…¥ã‚Šã®ãƒ•ã‚©ãƒ³ãƒˆã‚’ä½¿ç”¨ã§ãã¾ã™ã€‚ã¾ãŸã€æ—¥æœ¬èªžã‚„ä¸­å›½èªžãªã©ã®ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã®Robotoãƒ•ã‚©ãƒ³ãƒˆã«å«ã¾ã‚Œã¦ã„ãªã„æ–‡å­—ã‚’ä½¿ç”¨ã—ã¦ã„ã‚‹å ´åˆã€PDFã§ã¯[è±†è…ï¼ˆTofuï¼‰](https://fonts.google.com/knowledge/glossary/tofu)ã¨ã—ã¦è¡¨ç¤ºã•ã‚Œã¾ã™ã€‚

ã“ã®æ©Ÿèƒ½ã‚’ä½¿ç”¨ã—ã¦ã€ã“ã‚Œã‚‰ã®å•é¡Œã‚’è§£æ±ºã™ã‚‹ã“ã¨ãŒã§ãã¾ã™ã€‚

## ãƒ•ã‚©ãƒ³ãƒˆã‚¿ã‚¤ãƒ—ã«ã¤ã„ã¦

ä»¥ä¸‹ã®ã‚ˆã†ã«`@weberon/common`ã‹ã‚‰ã‚¤ãƒ³ãƒãƒ¼ãƒˆã§ãã¾ã™ã€‚

```ts
import type { Font } from '@weberon/common';
```

ãƒ•ã‚©ãƒ³ãƒˆã®åž‹ã¯ä»¥ä¸‹ã®é€šã‚Šã§ã™ã€‚

```ts
type Font = {
  [fontName: string]: {
    data: string | Uint8Array | ArrayBuffer;
    fallback?: boolean;
    subset?: boolean;
  };
};
```
- `data`: `http`ã§å§‹ã¾ã‚‹`string`ã‚’ç™»éŒ²ã™ã‚‹ã¨ã€è‡ªå‹•çš„ã«ãƒ•ã‚§ãƒƒãƒã•ã‚Œã¾ã™ã€‚ã¾ãŸã¯ã€`Uint8Array | ArrayBuffer`ã®ã‚ˆã†ãªãƒã‚¤ãƒŠãƒªãƒ‡ãƒ¼ã‚¿ã‚’ç›´æŽ¥è¨­å®šã—ã¾ã™ã€‚
- \*`fallback`: trueã«è¨­å®šã™ã‚‹ã¨ã€`fontName`ãŒè¨­å®šã•ã‚Œã¦ã„ãªã„å ´åˆã«ä½¿ç”¨ã™ã‚‹ãƒ•ã‚©ãƒ³ãƒˆã«ãªã‚Šã¾ã™ã€‚**ãƒ•ã‚©ãƒ³ãƒˆã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã®ã†ã¡1ã¤ã ã‘ã‚’trueã«è¨­å®šã™ã‚‹å¿…è¦ãŒã‚ã‚Šã¾ã™ã€‚**
- \*`subset`: ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã¯trueã§ã™ãŒã€ãƒ•ã‚©ãƒ³ãƒˆåŸ‹ã‚è¾¼ã¿ã‚’ã‚µãƒ–ã‚»ãƒƒãƒˆã«ã—ãªã„ã‚ˆã†ã«falseã«è¨­å®šã§ãã¾ã™ã€‚ï¼ˆã“ã®è¨­å®šã¯ã€ç‰¹å®šã®ãƒ•ã‚©ãƒ³ãƒˆã‚’ã‚µãƒ–ã‚»ãƒƒãƒˆã§åŸ‹ã‚è¾¼ã‚€éš›ã®fontkitã®ãƒã‚°ã«å¯¾å¿œã™ã‚‹ãŸã‚ã®ã‚‚ã®ã§ã™ã€‚ï¼‰

```ts
const font: Font = {
  serif: {
    data: 'https://example.com/fonts/serif.ttf',
    fallback: true,
  },
  sans_serif: {
    data: 'https://example.com/fonts/sans_serif.ttf',
  },
};
```

## ãƒ•ã‚©ãƒ³ãƒˆã®è¨­å®šæ–¹æ³•

ã‚¸ã‚§ãƒãƒ¬ãƒ¼ã‚¿ãƒ¼ã¨UIãƒ‘ãƒƒã‚±ãƒ¼ã‚¸ã§ãƒ•ã‚©ãƒ³ãƒˆã‚’è¨­å®šã™ã‚‹æ–¹æ³•ã‚’è¦‹ã¦ã¿ã¾ã—ã‚‡ã†ã€‚

### ã‚¸ã‚§ãƒãƒ¬ãƒ¼ã‚¿ãƒ¼

[generate](/docs/getting-started#generator)é–¢æ•°ã®ã‚ªãƒ—ã‚·ãƒ§ãƒ³ã¨ã—ã¦ãƒ•ã‚©ãƒ³ãƒˆã‚’è¨­å®šã—ã¾ã™ã€‚

```ts
import { Template, BLANK_PDF, Font } from '@weberon/common';
import { generate } from '@weberon/generator';

const font: Font = {
  serif: {
    data: 'https://example.com/fonts/serif.ttf',
    fallback: true,
  },
  sans_serif: {
    data: 'https://example.com/fonts/sans_serif.ttf',
  },
};
const template: Template = {
  basePdf: BLANK_PDF,
  schemas: [
    [
      {
        name: 'a',
        type: 'text',
        fontName: 'serif',
        position: { x: 0, y: 0 },
        width: 10,
        height: 10,
      },
      {
        name: 'b',
        type: 'text',
        fontName: 'sans_serif',
        position: { x: 10, y: 10 },
        width: 10,
        height: 10,
      },
      {
        // <- ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯ãƒ•ã‚©ãƒ³ãƒˆã‚’ä½¿ç”¨ï¼ˆserifï¼‰
        name: 'c',
        type: 'text',
        position: { x: 20, y: 20 },
        width: 10,
        height: 10,
      },
    ],
  ],
};
const inputs = [{ a: 'a1', b: 'b1', c: 'c1' }];

generate({ template, inputs, options: { font } }).then((pdf) => {
  console.log(pdf);

  // ãƒ–ãƒ©ã‚¦ã‚¶
  // const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
  // window.open(URL.createObjectURL(blob));

  // Node.js
  // fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
});
```

### UI

UIã§ãƒ•ã‚©ãƒ³ãƒˆã‚’è¨­å®šã™ã‚‹æ–¹æ³•ã¯2ã¤ã‚ã‚Šã¾ã™ã€‚ã‚¤ãƒ³ã‚¹ã‚¿ãƒ³ã‚¹åˆæœŸåŒ–æ™‚ã¨ã€ãƒ¡ã‚½ãƒƒãƒ‰ã‚’é€šã˜ã¦ã®è¨­å®šã§ã™ã€‚  
ã‚µãƒ³ãƒ—ãƒ«ã‚³ãƒ¼ãƒ‰ã¯[ãƒ‡ã‚¶ã‚¤ãƒŠãƒ¼](/docs/getting-started#designer)ç”¨ã§ã™ãŒã€åŒã˜æ–¹æ³•ã§[ãƒ•ã‚©ãƒ¼ãƒ ](/docs/getting-started#form)ã¨[ãƒ“ãƒ¥ãƒ¼ãƒ¯ãƒ¼](/docs/getting-started#viewer)ã«ã‚‚ä½¿ç”¨ã§ãã¾ã™ã€‚

#### ã‚¤ãƒ³ã‚¹ã‚¿ãƒ³ã‚¹åˆæœŸåŒ–æ™‚ã«ãƒ•ã‚©ãƒ³ãƒˆã‚’è¨­å®š

```ts
import { Designer } from '@weberon/ui';

const domContainer = document.getElementById('container');
const template = {
  // çœç•¥...
};
const font = {
  serif: {
    data: 'https://example.com/fonts/serif.ttf',
    fallback: true,
  },
  sans_serif: {
    data: 'https://example.com/fonts/sans_serif.ttf',
  },
};

const designer = new Designer({ domContainer, template, options: { font } });
```

#### `updateOptions`ã§ãƒ•ã‚©ãƒ³ãƒˆã‚’æ›´æ–°

```ts
const font = {
  serif: {
    data: 'https://example.com/fonts/serif.ttf',
  },
  sans_serif: {
    data: 'https://example.com/fonts/sans_serif.ttf',
    fallback: true,
  },
};
designer.updateOptions({ font });
```

