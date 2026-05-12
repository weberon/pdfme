# Migration Guide v6

ã“ã®ãƒ‰ã‚­ãƒ¥ãƒ¡ãƒ³ãƒˆã¯ã€æ¬¡ã®ãƒ¡ã‚¸ãƒ£ãƒ¼ãƒªãƒªãƒ¼ã‚¹ã§äºˆå®šã—ã¦ã„ã‚‹ç ´å£Šçš„å¤‰æ›´ã¨ã€ã‚¢ãƒ—ãƒªã‚±ãƒ¼ã‚·ãƒ§ãƒ³ã€ã‚µãƒ³ãƒ—ãƒ«ã€ãƒ­ãƒ¼ã‚«ãƒ«é–‹ç™ºç’°å¢ƒã§å¿…è¦ã«ãªã‚‹æœ€å°é™ã®ç§»è¡Œä½œæ¥­ã‚’ã¾ã¨ã‚ãŸã‚‚ã®ã§ã™ã€‚

## ç ´å£Šçš„å¤‰æ›´

| å¤‰æ›´                        | å½±éŸ¿ã‚’å—ã‘ã‚‹ãƒ¦ãƒ¼ã‚¶ãƒ¼                                                         | å¿…è¦ãªå¯¾å¿œ                               |
| --------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| `ESM-only` ãƒ‘ãƒƒã‚±ãƒ¼ã‚¸       | `require('@weberon/...')` ã‚’ä½¿ã£ã¦ã„ã‚‹ãƒ¦ãƒ¼ã‚¶ãƒ¼                                 | `import` / `export` æ§‹æ–‡ã¸ç§»è¡Œ           |
| `Node 20+` æœ€ä½Žè¦ä»¶         | Node 16 / 18 ãƒ¦ãƒ¼ã‚¶ãƒ¼                                                        | Node 20 LTS ä»¥é™ã¸æ›´æ–°                   |
| å†…éƒ¨ `dist/*` import å»ƒæ­¢   | `@weberon/*/dist/...` ã‚„ `@weberon/*/cjs/src/...` ã‚’ç›´æŽ¥ import ã—ã¦ã„ã‚‹ãƒ¦ãƒ¼ã‚¶ãƒ¼ | package root ã® public export ã®ã¿ã‚’ä½¿ç”¨ |

## ã‚µãƒãƒ¼ãƒˆãƒãƒªã‚·ãƒ¼

| é …ç›®                   | æ–¹é‡       |
| ---------------------- | ---------- |
| ãƒ©ãƒ³ã‚¿ã‚¤ãƒ              | Node 20+   |
| ãƒ–ãƒ©ã‚¦ã‚¶å‘ã‘ã‚¿ãƒ¼ã‚²ãƒƒãƒˆ | `es2020`   |
| ãƒ¢ã‚¸ãƒ¥ãƒ¼ãƒ«å½¢å¼         | `ESM-only` |

## ç§»è¡Œæ–¹æ³•

### CommonJS ã‹ã‚‰ ESM ã¸

å¤‰æ›´å‰:

```js
const { BLANK_PDF } = require('@weberon/common');
const { generate } = require('@weberon/generator');
```

å¤‰æ›´å¾Œ:

```ts
import { BLANK_PDF } from '@weberon/common';
import { generate } from '@weberon/generator';
```

Node.js ã§ ESM ã‹ã‚‰ãƒ•ã‚¡ã‚¤ãƒ«ã‚’æ›¸ãå‡ºã™å ´åˆã¯ã€`__dirname` ã®ä»£ã‚ã‚Šã« `fileURLToPath(import.meta.url)` ã‚’ä½¿ã„ã¾ã™ã€‚

```ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### ãƒ‘ãƒƒã‚±ãƒ¼ã‚¸å†…éƒ¨ãƒ‘ã‚¹ã®å»ƒæ­¢

å¤‰æ›´å‰:

```ts
import { generate } from '@weberon/generator/cjs/src/index.js';
import { pdf2img } from '@weberon/converter/cjs/src/index.node.js';
```

å¤‰æ›´å¾Œ:

```ts
import { generate } from '@weberon/generator';
import { pdf2img } from '@weberon/converter';
```

### Node 20+

æ¬¡ã®ãƒ¡ã‚¸ãƒ£ãƒ¼ãƒªãƒªãƒ¼ã‚¹ã‚’æŽ¡ç”¨ã™ã‚‹å‰ã«ã€ãƒ­ãƒ¼ã‚«ãƒ«é–‹ç™ºç’°å¢ƒã¨ CI ã‚’ Node 20 LTS ä»¥é™ã¸æ›´æ–°ã—ã¦ãã ã•ã„ã€‚

## ãƒ¡ãƒ³ãƒ†ãƒŠãƒ¼å‘ã‘ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆ

- ãƒªãƒªãƒ¼ã‚¹å‰ã« GitHub Discussions ã¾ãŸã¯ Issue ã§æ–¹é‡ã‚’å‘ŠçŸ¥ã™ã‚‹ã€‚
- examplesã€docsã€playground ã‚’ public export ã®ã¿ä½¿ã†å½¢ã«æ›´æ–°ã™ã‚‹ã€‚
- Node å‘ã‘ã‚µãƒ³ãƒ—ãƒ«ã‹ã‚‰ `require()` ã‚’æ®µéšŽçš„ã«é™¤åŽ»ã™ã‚‹ã€‚
- ãƒ‰ã‚­ãƒ¥ãƒ¡ãƒ³ãƒˆã«å†…éƒ¨ `dist/*` import ãŒæ®‹ã£ã¦ã„ãªã„ã“ã¨ã‚’ç¢ºèªã™ã‚‹ã€‚

