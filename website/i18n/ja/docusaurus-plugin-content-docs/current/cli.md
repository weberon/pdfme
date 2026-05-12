# CLI

`@weberon/cli` ã¯ã€JSON-first ãª pdfme workflow ã®ãŸã‚ã®ã‚³ãƒžãƒ³ãƒ‰ãƒ©ã‚¤ãƒ³ã‚¤ãƒ³ã‚¿ãƒ¼ãƒ•ã‚§ãƒ¼ã‚¹ã§ã™ã€‚

ä¸»ãªç”¨é€”:

- custom Node script ã‚’æ›¸ã‹ãšã« template ã¨ inputs ã‹ã‚‰ PDF ã‚’ç”Ÿæˆã™ã‚‹
- `generate` ã®å‰ã« template ã‚„ unified job ã‚’æ¤œè¨¼ã™ã‚‹
- CI ã‚„ agent å®Ÿè¡Œå‰ã« runtimeã€fontã€`basePdf`ã€å‡ºåŠ›å…ˆã®å•é¡Œã‚’è¨ºæ–­ã™ã‚‹
- æ—¢å­˜ PDF ã‚’ç”»åƒã‚„ãƒšãƒ¼ã‚¸ã‚µã‚¤ã‚ºæƒ…å ±ã«å¤‰æ›ã™ã‚‹
- official example ã‚’ template ã¾ãŸã¯ unified job ã¨ã—ã¦å–ã‚Šå‡ºã™

## ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«

Node.js 20 ä»¥é™ãŒå¿…è¦ã§ã™ã€‚

```bash
npm install -D @weberon/cli
```

`npx` ã‹ã‚‰ç›´æŽ¥å®Ÿè¡Œã™ã‚‹ã“ã¨ã‚‚ã§ãã¾ã™ã€‚

```bash
npx @weberon/cli generate --help
```

## ã‚³ãƒžãƒ³ãƒ‰ä¸€è¦§

- `pdfme generate`
  - unified job ã¾ãŸã¯ `--template` + `--inputs` ã‹ã‚‰ PDF ã‚’ç”Ÿæˆã™ã‚‹
  - å¿…è¦ã«å¿œã˜ã¦ãƒšãƒ¼ã‚¸ç”»åƒã‚‚å‡ºåŠ›ã™ã‚‹
  - ç”»åƒã«ã‚°ãƒªãƒƒãƒ‰ç·šã¨ schema å¢ƒç•Œã‚’é‡ã­ã‚‰ã‚Œã‚‹
- `pdfme validate`
  - ç”Ÿæˆå‰ã« template ã¾ãŸã¯ unified job ã‚’æ¤œè¨¼ã™ã‚‹
  - `--json` ã§ machine-readable ãª inspection ã‚’è¿”ã™
- `pdfme doctor`
  - ç’°å¢ƒã€inputã€fontã€`basePdf`ã€cacheã€output path ã‚’è¨ºæ–­ã™ã‚‹
- `pdfme pdf2img`
  - æ—¢å­˜ PDF ã‚’ãƒšãƒ¼ã‚¸ç”»åƒã¸å¤‰æ›ã™ã‚‹
- `pdfme pdf2size`
  - PDF ã®ãƒšãƒ¼ã‚¸ã‚µã‚¤ã‚ºã‚’ãƒŸãƒªãƒ¡ãƒ¼ãƒˆãƒ«å˜ä½ã§ç¢ºèªã™ã‚‹
- `pdfme examples`
  - official example ã‚’ä¸€è¦§è¡¨ç¤ºã¾ãŸã¯å‡ºåŠ›ã™ã‚‹

## `pdfme generate`

`generate` ã¯æ¬¡ã® 2 å½¢å¼ã‚’å—ã‘ä»˜ã‘ã¾ã™ã€‚

- unified job file
- template file + separate inputs file

ä½¿ç”¨ä¾‹:

```bash
# Unified job file: { template, inputs, options? }
pdfme generate job.json -o out.pdf

# Template + inputs ã‚’åˆ¥ãƒ•ã‚¡ã‚¤ãƒ«ã§æŒ‡å®š
pdfme generate -t template.json -i inputs.json -o out.pdf

# ãƒšãƒ¼ã‚¸ç”»åƒã‚‚å‡ºåŠ›
pdfme generate job.json -o out.pdf --image

# ç”»åƒã«ã‚°ãƒªãƒƒãƒ‰ç·šã¨ schema å¢ƒç•Œã‚’é‡ã­ã‚‹
pdfme generate job.json -o out.pdf --grid

# CLI ã‹ã‚‰ basePdf ã‚’ä¸Šæ›¸ã
pdfme generate -t template.json -i inputs.json --basePdf invoice.pdf -o out.pdf

# CI / agent å‘ã‘ã®æ§‹é€ åŒ–å‡ºåŠ›
pdfme generate job.json -o out.pdf --image --json
```

ä¸»ãªã‚ªãƒ—ã‚·ãƒ§ãƒ³:

| ã‚ªãƒ—ã‚·ãƒ§ãƒ³ | ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆ | èª¬æ˜Ž |
| --- | --- | --- |
| `[file]` | - | `{ template, inputs, options? }` ã‚’å«ã‚€ unified job file |
| `-t, --template` | - | Template JSON file |
| `-i, --inputs` | - | Input JSON file |
| `-o, --output` | `output.pdf` | å‡ºåŠ› PDF ãƒ‘ã‚¹ |
| `--force` | `false` | æš—é»™ã® `output.pdf` ä¸Šæ›¸ãã‚’è¨±å¯ã™ã‚‹ |
| `--image` | `false` | ç”Ÿæˆã—ãŸå„ãƒšãƒ¼ã‚¸ã®ç”»åƒã‚‚æ›¸ãå‡ºã™ |
| `--imageFormat` | `png` | `png` ã¾ãŸã¯ `jpeg` |
| `--scale` | `1` | ç”»åƒãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°ã® scale |
| `--grid` | `false` | ç”Ÿæˆç”»åƒã«ã‚°ãƒªãƒƒãƒ‰ç·šã¨ schema å¢ƒç•Œã‚’æç”»ã™ã‚‹ |
| `--gridSize` | `10` | ã‚°ãƒªãƒƒãƒ‰é–“éš”(mm) |
| `--font` | - | `Name=path.ttf` å½¢å¼ã®ãƒ­ãƒ¼ã‚«ãƒ« custom fontã€‚è¤‡æ•°æŒ‡å®šæ™‚ã¯ã‚«ãƒ³ãƒžåŒºåˆ‡ã‚Š |
| `--basePdf` | - | `template.basePdf` ã‚’ PDF file path ã§ä¸Šæ›¸ãã™ã‚‹ |
| `--noAutoFont` | `false` | CJK æ–‡å­—å‘ã‘ã® `NotoSansJP` è‡ªå‹•è§£æ±ºã‚’ç„¡åŠ¹åŒ–ã™ã‚‹ |
| `-v, --verbose` | `false` | å…¥å‡ºåŠ›ã‚„æç”»æ¡ä»¶ã‚’ stderr ã«å‡ºã™ |
| `--json` | `false` | stdout ã« JSON ã®ã¿ã‚’å‡ºã™ |

æ³¨æ„ç‚¹:

- `output.pdf` ãŒæ—¢ã«å­˜åœ¨ã—ã€ã‹ã¤ `-o` ã‚„ `--force` ã‚’æ˜Žç¤ºã—ã¦ã„ãªã„å ´åˆã€`generate` ã¯ä¸Šæ›¸ãã‚’æ‹’å¦ã—ã¾ã™ã€‚
- `--grid` ã¯ `--image` ã‚’ä»˜ã‘ã¦ã„ãªãã¦ã‚‚ç”»åƒå‡ºåŠ›ã‚’æœ‰åŠ¹ã«ã—ã¾ã™ã€‚
- ç”Ÿæˆç”»åƒã¯å‡ºåŠ› PDF ã¨åŒã˜ãƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒªã« `<output-base>-1.png`, `<output-base>-2.png` ã®å½¢å¼ã§ä¿å­˜ã•ã‚Œã¾ã™ã€‚`--imageFormat jpeg` ã®å ´åˆã¯ `.jpg` ã«ãªã‚Šã¾ã™ã€‚
- `--font` ã®ãƒ­ãƒ¼ã‚«ãƒ«ãƒ‘ã‚¹ã¯ CLI å®Ÿè¡Œæ™‚ã® current working directory åŸºæº–ã§è§£æ±ºã•ã‚Œã¾ã™ã€‚
- unified job ã® `options.font.<name>.data` ã«ã‚ã‚‹ãƒ­ãƒ¼ã‚«ãƒ«ãƒ‘ã‚¹ã¯ã€job file ã¾ãŸã¯ template file ã®ã‚ã‚‹ãƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒªåŸºæº–ã§è§£æ±ºã•ã‚Œã¾ã™ã€‚
- CJK ãŒå«ã¾ã‚Œã€ã‹ã¤æ˜Žç¤ºçš„ãª font source ãŒãªã„å ´åˆã€CLI ã¯ `--noAutoFont` ãŒä»˜ã„ã¦ã„ãªã„é™ã‚Š `NotoSansJP` ã‚’è‡ªå‹•è§£æ±ºã—ã¦ cache ã—ã¾ã™ã€‚

Unified job ã®ä¾‹:

```json
{
  "template": {
    "basePdf": {
      "width": 210,
      "height": 297,
      "padding": [20, 20, 20, 20]
    },
    "schemas": [
      [
        {
          "name": "customerName",
          "type": "text",
          "position": { "x": 20, "y": 50 },
          "width": 80,
          "height": 10
        }
      ]
    ]
  },
  "inputs": [
    { "customerName": "John Doe" }
  ],
  "options": {
    "font": {
      "NotoSansJP": {
        "data": "https://fonts.gstatic.com/...",
        "fallback": false,
        "subset": true
      }
    }
  }
}
```

`template.basePdf` ã«ã¯ `"./invoice.pdf"` ã®ã‚ˆã†ãªç›¸å¯¾ PDF path ã‚‚æŒ‡å®šã§ãã¾ã™ã€‚å¿…è¦ãªã‚‰ `--basePdf` ã§å®Ÿè¡Œæ™‚ã«ä¸Šæ›¸ãã§ãã¾ã™ã€‚

`--json` æŒ‡å®šæ™‚ã® stdout ã¯ JSON ã®ã¿ã«ãªã‚Šã¾ã™ã€‚

```json
{
  "ok": true,
  "command": "generate",
  "mode": "job",
  "templatePageCount": 1,
  "inputCount": 1,
  "pageCount": 1,
  "outputPath": "out.pdf",
  "outputBytes": 12345,
  "imagePaths": ["out-1.png"]
}
```

## `pdfme validate`

`validate` ã¯ template file ã¾ãŸã¯ unified job file ã‚’ã€ç”Ÿæˆå‰ã«æ¤œè¨¼ã—ã¾ã™ã€‚

ä½¿ç”¨ä¾‹:

```bash
pdfme validate template.json
pdfme validate job.json --json
cat job.json | pdfme validate - --json
pdfme validate template.json --strict
pdfme validate template.json -v --json
```

ä¸»ãªæ¤œè¨¼å†…å®¹:

- pdfme ã® template validation ã«ã‚ˆã‚‹æ§‹é€ ãƒã‚§ãƒƒã‚¯
- æœªçŸ¥ã® schema type
- åŒä¸€ãƒšãƒ¼ã‚¸å†…ã®é‡è¤‡ field name
- ãƒšãƒ¼ã‚¸ã‚’ã¾ãŸã„ã åŒå field ã® warning
- ãƒšãƒ¼ã‚¸å¢ƒç•Œå¤–ã«ã¯ã¿å‡ºã™ field position ã® warning
- template top-level ã®æœªçŸ¥ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰ã«å¯¾ã™ã‚‹ warning
- unified job ãŒ `generate` ã«æ¸¡ã›ã‚‹å½¢ã‹ã©ã†ã‹
- unified job ã«å¯¾ã™ã‚‹ field-level input contract check

ä¾¿åˆ©ãªãƒ•ãƒ©ã‚°:

- `--strict`
  - warning ã‚‚ failure æ‰±ã„ã«ã™ã‚‹
- `--json`
  - `valid`, `errors`, `warnings`, `inspection`, `inputHints` ã‚’è¿”ã™
- `-v, --verbose`
  - å…¥åŠ› sourceã€modeã€ä»¶æ•°ã€ã‚µãƒžãƒªã‚’ stderr ã«å‡ºã™

`inputHints` ã«ã‚ˆã‚Šã€`generate` å®Ÿè¡Œå‰ã« writable field ãŒä½•ã‚’æœŸå¾…ã—ã¦ã„ã‚‹ã‹ã‚’åˆ¤å®šã§ãã¾ã™ã€‚ç¾è¡Œ CLI ã¯æ¬¡ã®å…¥åŠ›ç¨®åˆ¥ã‚’åŒºåˆ¥ã—ã¾ã™ã€‚

- plain string
- `contentKind` ä»˜ãã® asset-like string
- human-readable ãª `rule` ã‚’æŒã¤ barcode string
- `string[][]` ã® table payload
- `format` metadata ã‚’æŒã¤ canonical date/time string
- `select` / `checkbox` / `radioGroup` ã® constrained enum string
- `multiVariableText` å‘ã‘ã® JSON string object

## `pdfme doctor`

`doctor` ã¯å®Ÿè¡Œç’°å¢ƒã‚„ç‰¹å®šã® template/job ã‚’ã€ç”Ÿæˆå‰ã«è¨ºæ–­ã—ã¾ã™ã€‚

ä½¿ç”¨ä¾‹:

```bash
# ç’°å¢ƒè¨ºæ–­
pdfme doctor

# Template ã¾ãŸã¯ job ã®è¨ºæ–­
pdfme doctor job.json --json

# stdin ã‹ã‚‰è¨ºæ–­
cat job.json | pdfme doctor - --json

# Font ã«çµžã£ãŸè¨ºæ–­
pdfme doctor fonts job.json --json

# è‡ªå‹• CJK font è§£æ±ºã‚’ç„¡åŠ¹åŒ–ã—ãŸæ¡ä»¶ã§è¨ºæ–­
pdfme doctor job.json --noAutoFont --json

# generate ã¨åŒã˜ output path / image output æ¡ä»¶ã§äº‹å‰è¨ºæ–­
pdfme doctor job.json -o artifacts/out.pdf --image --imageFormat jpeg --json
```

## `pdfme pdf2img`

æ—¢å­˜ PDF ã‚’ãƒšãƒ¼ã‚¸ç”»åƒã«å¤‰æ›ã—ã¾ã™ã€‚

ä½¿ç”¨ä¾‹:

```bash
pdfme pdf2img invoice.pdf
pdfme pdf2img invoice.pdf --grid --gridSize 10
pdfme pdf2img invoice.pdf --pages 1-3
pdfme pdf2img invoice.pdf -o ./images --imageFormat jpeg
pdfme pdf2img invoice.pdf -o ./images --json
```

æŒ™å‹•:

- `-o, --output` ã¯ãƒ•ã‚¡ã‚¤ãƒ«åã§ã¯ãªããƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒªã‚’å—ã‘å–ã‚Šã¾ã™
- å‡ºåŠ›ãƒ•ã‚¡ã‚¤ãƒ«åã¯ `<input-base>-<page>.png` ã¾ãŸã¯ `.jpg` ã§ã™
- `--pages` ã¯ `1-3` ã‚„ `1,3,5` ã®ã‚ˆã†ãªå½¢å¼ã‚’å—ã‘å–ã‚Šã¾ã™
- `--grid` ã¯ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°ã•ã‚ŒãŸãƒšãƒ¼ã‚¸ç”»åƒã«ãƒŸãƒªãƒ¡ãƒ¼ãƒˆãƒ«ã‚°ãƒªãƒƒãƒ‰ã‚’æç”»ã—ã¾ã™
- `--json` ã§ã¯ `pageCount`, `selectedPageCount`, `outputPaths`, å„ãƒšãƒ¼ã‚¸ã® width/height ã‚’è¿”ã—ã¾ã™

## `pdfme pdf2size`

PDF ã®ãƒšãƒ¼ã‚¸ã‚µã‚¤ã‚ºã‚’ãƒŸãƒªãƒ¡ãƒ¼ãƒˆãƒ«å˜ä½ã§ç¢ºèªã—ã¾ã™ã€‚

ä½¿ç”¨ä¾‹:

```bash
pdfme pdf2size invoice.pdf
pdfme pdf2size invoice.pdf --json
```

æ¨™æº–ã‚µã‚¤ã‚ºã‚’æ¤œå‡ºã§ãã‚‹å ´åˆã€äººé–“å‘ã‘å‡ºåŠ›ã«ã¯ `A4 portrait` ã®ã‚ˆã†ãªãƒ©ãƒ™ãƒ«ã‚‚ä»˜ãã¾ã™ã€‚JSON å‡ºåŠ›ã®ä¾‹:

```json
{
  "ok": true,
  "command": "pdf2size",
  "pageCount": 1,
  "pages": [
    { "pageNumber": 1, "width": 210, "height": 297 }
  ]
}
```

## `pdfme examples`

playground ã® asset manifest ã‹ã‚‰ official example ã‚’ä¸€è¦§è¡¨ç¤ºã¾ãŸã¯å‡ºåŠ›ã—ã¾ã™ã€‚

ä½¿ç”¨ä¾‹:

```bash
# ä¸€è¦§è¡¨ç¤º
pdfme examples --list

# name æœªæŒ‡å®šã§ã‚‚ä¸€è¦§è¡¨ç¤º
pdfme examples

# Template ã‚’ stdout ã«å‡ºåŠ›
pdfme examples invoice

# Template ã‚’ãƒ•ã‚¡ã‚¤ãƒ«ã«ä¿å­˜
pdfme examples invoice -o template.json

# ã‚µãƒ³ãƒ—ãƒ«å…¥åŠ›ä»˜ã unified job ã‚’å‡ºåŠ›
pdfme examples invoice --withInputs -o job.json

# Manifest metadata ã‚’ JSON ã§å–å¾—
pdfme examples --list --json
```

æŒ™å‹•:

- manifest ã¨ template asset ã¯ `https://playground.pdfme.com/template-assets` ã‹ã‚‰å–å¾—ã•ã‚Œã¾ã™
- `PDFME_EXAMPLES_BASE_URL` ç’°å¢ƒå¤‰æ•°ã§ base URL ã‚’ä¸Šæ›¸ãã§ãã¾ã™
- `--withInputs` ã§ã¯ sample inputs ã«åŠ ãˆã¦ã€official hosted font ãŒå¿…è¦ãªä¾‹ã§ã¯ `options.font` ã‚‚åŒæ¢±ã•ã‚Œã¾ã™
- `--json` ã® list mode ã§ã¯ template nameã€schema typeã€font nameã€page count ãªã©ã® metadata ã‚’è¿”ã—ã¾ã™

## Font Contract

CLI ã¯ font ã‚’ã€Œæ˜Žç¤ºçš„ãª source contractã€ã¨ã—ã¦æ‰±ã„ã¾ã™ã€‚

ã‚µãƒãƒ¼ãƒˆã•ã‚Œã‚‹ explicit font source:

- `--font Name=./path.ttf` ã«ã‚ˆã‚‹ local `.ttf` file
- unified job `options.font.<name>.data` ã«ã‚ã‚‹ local `.ttf` file
- public ãª direct `http(s)` font asset URL
- `.ttf` data URI
- programmatic use ã«ãŠã‘ã‚‹ inline bytes

ç¾è¡Œãƒ«ãƒ¼ãƒ«:

- æ˜Žç¤ºçš„ã«ã‚µãƒãƒ¼ãƒˆã™ã‚‹ custom font format ã¯ `.ttf` ã®ã¿
- `.otf` ã¨ `.ttc` ã¯ reject ã•ã‚Œã‚‹
- `fonts.googleapis.com/css*` ã® stylesheet URL ã¯ reject ã•ã‚Œã‚‹
- unsafe/private/loopback ãª `http(s)` URL ã¯ reject ã•ã‚Œã‚‹
- explicit remote font fetch ã¯ 15 ç§’ timeoutã€32 MiB size limit ã§è§£æ±ºã•ã‚Œã‚‹
- remote font failure ã¯ `EFONT` ã§è¿”ã‚‹

CJK å‘ã‘ã®è‡ªå‹• `NotoSansJP` è§£æ±ºã¯ã€æ˜Žç¤ºçš„ãª font source ãŒãªã„ã¨ãã ã‘ä½¿ã‚ã‚Œã¾ã™ã€‚CJK ã‚’å«ã¿ã€font ãŒ cache ã•ã‚Œã¦ãŠã‚‰ãšã€ã•ã‚‰ã«è‡ªå‹•è§£æ±ºãŒç„¡åŠ¹ã¾ãŸã¯ä¸å¯èƒ½ãªå ´åˆã¯ `generate` ã¯ `EFONT` ã§å¤±æ•—ã—ã¾ã™ã€‚

## Structured Output ã¨ Exit Code

`--json` ã‚’ä»˜ã‘ã‚‹ã¨:

- stdout ã¯ JSON ã®ã¿ã«ãªã‚‹
- æˆåŠŸ payload ã¯ `ok: true`
- failure payload ã¯ `ok: false` ã¨ `error.code`, `error.message`, å ´åˆã«ã‚ˆã£ã¦ã¯ `error.details` ã‚’å«ã‚€
- `-v, --verbose` ã®äººé–“å‘ã‘æƒ…å ±ã¯å¼•ãç¶šã stderr ã«å‡ºã‚‹

ç¾è¡Œã® exit code åŒºåˆ†:

| ã‚³ãƒ¼ãƒ‰ | æ„å‘³ |
| --- | --- |
| `0` | æˆåŠŸ |
| `1` | argument / validation / unsupported input failure |
| `2` | runtime / font-resolution failure |
| `3` | file I/O failure |

## å…¸åž‹çš„ãªä½¿ã„æ–¹

official example ã‹ã‚‰ job ã‚’ä½œæˆã—ã¦ã€ã¾ãšè¨ºæ–­ã—ã€ç”»åƒã§ç¢ºèªã—ã¦ã‹ã‚‰ PDF ã‚’ä½œæˆã—ã¾ã™ã€‚

```bash
pdfme examples invoice --withInputs -o job.json
pdfme doctor job.json --json
pdfme generate job.json -o out.pdf --image --grid
```

æ—¢å­˜ PDF ã‚’ basePdf ã¨ã—ã¦ä½¿ã† overlay workflow:

```bash
pdfme pdf2img invoice.pdf --grid --gridSize 10
pdfme pdf2size invoice.pdf --json
pdfme doctor template.json -o out.pdf --image --json
pdfme generate -t template.json -i inputs.json -o out.pdf --image --grid
```

