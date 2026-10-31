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

## Animations

Scroll reveals, a hero entrance and parallax use GSAP 3.12.5 and ScrollTrigger (loaded from a CDN, pinned to that version). All animation code is in `HTML/assets/js/animations.js`. You switch effects on with data attributes only. Live examples: `HTML/components/animations.html`.

**1. Load the scripts** only on pages that animate. In `<head>`:

```html
<script>document.documentElement.classList.add('js');if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim-off');setTimeout(function(){if(!window.__animReady)document.documentElement.classList.add('anim-off')},4000)</script>
```

Before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
<script src="assets/js/animations.js" defer></script>
```

**2. Attributes**

| Attribute | Use |
|---|---|
| `data-animate="fade-up"` | `fade-up`, `fade-in`, `fade-down`, `slide-left`, `slide-right`, `zoom-in` |
| `data-animate-delay="0.2"` | Delay in seconds (default 0) |
| `data-animate-duration="0.8"` | Duration in seconds (default 0.8) |
| `data-animate-stagger="0.1"` | On a parent: direct children animate one after another |
| `data-animate-once="false"` | Replay every time (default: plays once) |
| `data-parallax="0.2"` | Parallax speed (use on its own element) |
| `data-hero` / `data-hero-item` | Hero entrance on load; items play in page order, `data-hero-item="image"` plays last |

**3. How to disable animations**

- One element: delete its `data-animate` (or other) attribute.
- One page: remove the three script tags and the `<head>` snippet.
- Whole site: remove the three script tags. Content is never hidden without the script running.
- Visitors who prefer reduced motion see no animation automatically.

## Property map

`HTML/components/property-map.html` shows the property map. Add your Google Maps API key in `data-map-key` on the `.map-view` element (Maps JavaScript API, restrict the key to your domain). Without a key a demo map is shown.

## Credits and licenses

Google Maps JavaScript API (loaded with your own key, not bundled), Bootstrap 5.3 (MIT), GSAP and ScrollTrigger 3.12.5 (free "Standard No Charge" license, loaded from a CDN, not bundled), Fraunces and DM Sans (SIL Open Font License 1.1). Icons and avatar illustrations are original artwork. See the documentation for details.
