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
| `learn/` | Wonder Deck, a standalone kids quiz-card app at `/learn/` (`learn.css`, `learn.js`, own strict CSP, `noindex`, not in the sitemap). Kids' personal details are entered in the app and stored in the browser only: never put them in the repo |
| `styles.css` | Shared styles. Each page sets its own `--color-bg` / `--color-fg` and adds page-specific rules in an inline `<style>` |
| `js/site.js` | Shared behaviors for every page (`window.CCD`), including the Lottie loader |
| `js/projects.js` | **Single source of truth for project metadata** (`CCD_PROJECTS`, `CCD_ARTICLES`), including each page's colors. Feeds the home grid, JSON-LD, OG cards, RSS |
| `js/*.js` | Page scripts (`index.js`, `about.js`, `shoe-rotation.js`, Iris showcase scripts, etc.) |
| `js/vendor/lottie.ccd.min.js` | Custom lottie-web 5.13.0 build (SVG renderer plus Drop Shadow, nothing else), loaded on demand by `site.js`. Rebuild with `bash tools/lottie/build.sh` |
| `tools/lottie/` | Source for that custom build, plus `check-features.mjs` (run it after adding an animation) |
| `animations/` | Lottie JSON (images embedded as WebP) plus one MP4 |
| `img/` | Site images (WebP with AVIF twins, responsive `-w800` / `-w1600` variants), MP4/WebM, `og/` cards, `shoes/` rotation frames |
| `fonts/` | Self-hosted DM Sans (body) and Playfair Display (display) |
| `*.mjs` (root) | Tooling scripts, never deployed |
| `checks/validate-site.mjs` | Link, JSON-LD, sitemap, llms.txt, RSS validator |

CSS and JS references carry a `?v=` content hash for cache busting. Never edit it by hand: run `node stamp-assets.mjs` after changing any CSS or JS file (CI fails if a hash is stale).

## Local dev
- `npm ci`, then `node serve.mjs` serves the root at `http://localhost:3000` (byte ranges supported, so video works in Safari). Don't start a second instance if one is running.
- Never screenshot a `file://` URL.
- Screenshots: `node screenshot.mjs <url> [label]` saves to `temporary screenshots/`; `node shot-sel.mjs` captures one section by CSS selector.

## Checks (same as CI)
```
node checks/validate-site.mjs
node inject-colors.mjs && node inject-schema.mjs && node generate-rss.mjs && node generate-sitemap.mjs && node stamp-assets.mjs
git diff --exit-code -I '<lastmod>'      # generators must be idempotent
node inject-csp.mjs --check              # CSP meta tags match the policy in inject-csp.mjs
node serve.mjs &  node check-csp.mjs      # headless Chrome, every page: loads, JS errors, missing files, CSP
```
Locally, `check-csp.mjs` reports the analytics beacon failing against localhost. That's expected and tolerated. Anything else fails it: a page that doesn't load, an uncaught JavaScript error, a missing same-origin file, a console error, or a CSP violation.

To change the CSP, edit the policy in `inject-csp.mjs` and run it: it rewrites the meta tag on every root page (redirect stubs and `dino/`, `reba/` are left alone).

## Common tasks
**Adding images.** Original PNG/JPG sources don't live in the repo. They're on the Mac mini at `~/Desktop/ccd-originals/` (same folder paths as the repo).
1. Put the PNG/JPG in `img/`, run `node convert-webp.mjs`, then `node swap-html-to-webp.mjs` to point pages at the WebP.
2. `node generate-srcset.mjs` adds 800w/1600w variants and `srcset` for anything wider than 1200px. Animated WebPs are skipped.
3. `node generate-avif.mjs` makes `.avif` twins for images of 60 KB or more and wraps their `<img>` in `<picture>` with an AVIF `<source>` (WebP stays as the fallback). It encodes from the originals, so run it **before step 5** while they're still in `img/`, or pass `--originals ~/Desktop/ccd-originals`. It only keeps an AVIF that scores at least as well as the WebP (SSIM) and saves 10%+. Hero preloads are switched to AVIF automatically.
4. `node embed-image-credits.mjs` writes copyright metadata into the files, AVIF included (needs `exiftool`).
5. Move the PNG/JPG original to `~/Desktop/ccd-originals/` and delete it from the repo.

**Adding a project.** Add an entry to `CCD_PROJECTS` in `js/projects.js` (with the page's bg/fg colors). Then run `inject-colors.mjs` (writes the page's `--color-bg`/`--color-fg`, `theme-color`, next-project band and home card colors; never hand-edit those), `inject-schema.mjs`, `generate-og-cards.mjs` (needs the dev server running), and `generate-sitemap.mjs`. Add a write-up to `CCD_ARTICLES` and run `generate-rss.mjs`.

**Adding a Lottie.** Use a `[data-lottie]` container (or `CCD.loadLottie`, which returns a promise); the player loads itself on first use, so never add a `<script>` tag for it. Run `node tools/lottie/check-features.mjs` to confirm the animation only uses features in the custom build. If it embeds PNGs, add it to the `FILES` list in `optimize-lottie-images.mjs` and run that script to convert them to WebP.

**Video.** Ship H.264 MP4 (WebM optional), not `.mov`. Give `<video>` an `aspect-ratio` or width/height so layout doesn't shift.

## Hosting and deploys
- **Production: GitHub Pages**, published by the `deploy` job in `.github/workflows/checks.yml` after all checks pass on `main`. Requires Settings → Pages → Source: GitHub Actions.
- **Preview: Cloudflare** (`wrangler.toml`, project `ccd-preview`).
- **`.assetsignore` decides what's public on both.** Anything listed there (scripts, this file, package files, `.github`, `checks/`) is left out of the deploy. Add new non-site files to it.
- The repo itself is public on GitHub, so never commit anything private.
