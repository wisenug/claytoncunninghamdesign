# CLAUDE.md: claytoncunninghamdesign.com

Clayton Cunningham's portfolio. Hand-written static HTML, one shared stylesheet, small vanilla JS files. No framework, no bundler, no build step. Every page is a real file at the repo root.

## Hard rules
- **Match the existing site.** New markup inherits `styles.css` and the page's own tokens. No Tailwind, no CDN libraries, no new fonts, no restyling of existing components unless asked.
- **No em dashes** anywhere in site copy. Use commas, periods, or colons.
- **No third-party requests.** The CSP (see `inject-csp.mjs`) allows only self-hosted assets plus Cloudflare Web Analytics. No inline `<script>` code; JSON-LD blocks are the only inline scripts.
- **Respect reduced motion.** Animations and Lottie go through `CCD.prefersReducedMotion` / `CCD.loadLottie`.
- **Don't delete anything in `unused/`.** Despite the name, its files are live (the Coca-Cola dining gallery, Paradesmith media, the 404 background, TSHQ assets). Check references first.
- **Keep the redirect stubs** (`autotrader_icons.html`, `deloitte.html`, etc.). They preserve old URLs; their canonical points at the replacement page.
- Run the checks (below) before committing.

## Writing voice (case studies and write-ups)
- Plain, first-person prose. Concise, with room to breathe.
- Craft is the argument: show the work and the reasoning, not adjectives.
- No dates or timeline specifics in case studies.
- Copyright: every case study except Just for Funsies was made while employed at the company in its title, so the company holds the copyright. The Sketches, Illustrations and Doodles page is Clayton's original work, All Rights Reserved. `inject-schema.mjs` encodes this; keep it accurate when adding pages.

## Structure
| Path | What it is |
|---|---|
| `*.html` (root) | One file per page: home, about, case studies, process write-ups, licensing, 404, redirect stubs |
| `dino/`, `reba/` | Standalone fun pages, served at `/dino/` and `/reba/` |
| `styles.css` | Shared styles. Each page sets its own `--color-bg` / `--color-black` and adds page-specific rules in an inline `<style>` |
| `js/site.js` | Shared behaviors for every page (`window.CCD`), including the Lottie loader |
| `js/projects.js` | **Single source of truth for project metadata** (`CCD_PROJECTS`, `CCD_ARTICLES`). Feeds the home grid, JSON-LD, OG cards, RSS |
| `js/*.js` | Page scripts (`index.js`, `about.js`, `shoe-rotation.js`, Iris showcase scripts, etc.) |
| `js/vendor/lottie.min.js` | Vendored lottie-web 5.13.0 (SVG renderer) |
| `animations/` | Lottie JSON (images embedded as WebP) plus one MP4 |
| `img/` | Site images (WebP, responsive `-w800` / `-w1600` variants), MP4/WebM, `og/` cards, `shoes/` rotation frames |
| `fonts/` | Self-hosted DM Sans (body) and Playfair Display (display) |
| `*.mjs` (root) | Tooling scripts, never deployed |
| `checks/validate-site.mjs` | Link, JSON-LD, sitemap, llms.txt, RSS validator |

Script tags use `?v=` query strings for cache busting. Bump the value when you change a JS file.

## Local dev
- `npm ci`, then `node serve.mjs` serves the root at `http://localhost:3000` (byte ranges supported, so video works in Safari). Don't start a second instance if one is running.
- Never screenshot a `file://` URL.
- Screenshots: `node screenshot.mjs <url> [label]` saves to `temporary screenshots/`; `node shot-sel.mjs` captures one section by CSS selector.

## Checks (same as CI)
```
node checks/validate-site.mjs
node inject-schema.mjs && node generate-rss.mjs && node generate-sitemap.mjs
git diff --exit-code -I '<lastmod>'      # generators must be idempotent
node serve.mjs &  node check-csp.mjs      # headless Chrome: CSP and console errors
```
Locally, `check-csp.mjs` reports the analytics beacon failing against localhost. That's expected; only CSP violations fail it.

## Common tasks
**Adding images.** Original PNG/JPG sources don't live in the repo. They're on the Mac mini at `~/Desktop/ccd-originals/` (same folder paths as the repo).
1. Put the PNG/JPG in `img/`, run `node convert-webp.mjs`, then `node swap-html-to-webp.mjs` to point pages at the WebP.
2. `node generate-srcset.mjs` adds 800w/1600w variants and `srcset` for anything wider than 1200px. Animated WebPs are skipped.
3. `node embed-image-credits.mjs` writes copyright metadata into the files (needs `exiftool`).
4. Move the PNG/JPG original to `~/Desktop/ccd-originals/` and delete it from the repo.

**Adding a project.** Add an entry to `CCD_PROJECTS` in `js/projects.js` (with the page's bg/fg colors). Then run `inject-schema.mjs`, `generate-og-cards.mjs` (needs the dev server running), and `generate-sitemap.mjs`. Add a write-up to `CCD_ARTICLES` and run `generate-rss.mjs`.

**Adding a Lottie.** Load it with `CCD.loadLottie` or a `[data-lottie]` container. If it embeds PNGs, add it to the `FILES` list in `optimize-lottie-images.mjs` and run that script to convert them to WebP.

**Video.** Ship H.264 MP4 (WebM optional), not `.mov`. Give `<video>` an `aspect-ratio` or width/height so layout doesn't shift.

## Hosting and deploys
- **Production: GitHub Pages**, published by the `deploy` job in `.github/workflows/checks.yml` after all checks pass on `main`. Requires Settings → Pages → Source: GitHub Actions.
- **Preview: Cloudflare** (`wrangler.toml`, project `ccd-preview`).
- **`.assetsignore` decides what's public on both.** Anything listed there (scripts, this file, package files, `.github`, `checks/`) is left out of the deploy. Add new non-site files to it.
- The repo itself is public on GitHub, so never commit anything private.
