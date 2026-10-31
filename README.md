# Real Estate Template

A modern HTML template for real estate agencies, built on Bootstrap 5.3 with a Forest Green theme.

> **Status: in development (v0.4.0).** Design tokens, 44 components and all 19 pages are built. Remaining: final review, a real template name, and packaging.

## What is inside

All template files live in the [`HTML/`](HTML) folder.

| Path | What it is |
| --- | --- |
| [`HTML/index.html`](HTML/index.html) | The home page. The other 18 pages are in the same folder. |
| [`HTML/components/index.html`](HTML/components/index.html) | Component library: one page per component with live examples and copy-ready code. Open this first. |
| [`HTML/documentation/index.html`](HTML/documentation/index.html) | Full documentation: setup, customization, component reference, credits. |
| `HTML/assets/css/style.css` | Compiled theme. `style.min.css` is the minified version for production. |
| `HTML/assets/css/src/` | CSS source: design tokens, base, one file per component. |
| `HTML/build.js` | Rebuilds `style.css` from the source (Node.js, no dependencies). |

## Quick start

1. Open `HTML/components/index.html` in a browser. No installation needed.
2. Read `HTML/documentation/index.html` for setup and customization.

To change the design, edit the variables in `HTML/assets/css/src/00-tokens.css`, then run:

```bash
cd HTML
node build.js
```

## Design

- **Colors:** Forest Green `#173F35` primary, warm off-white `#F7F6F0` background, charcoal `#252B28` text, brass `#C0903F` accent.
- **Fonts:** Fraunces (headings) and DM Sans (body), both open source (SIL OFL).
- **Tokens:** CSS variable names match the variables in the Figma UI Kit.

## Credits and licenses

Bootstrap 5.3 (MIT), Fraunces and DM Sans (SIL Open Font License 1.1). Icons and avatar illustrations are original artwork. See the documentation for details.
