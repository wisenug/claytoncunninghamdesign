/* Responsive images: for every local <img> in the content pages whose source
   is wider than 1200px, generate 800w/1600w WebP variants (skipped if already
   present and fresh) and add srcset/sizes. `sizes` is derived from the layout
   container (grid column count, full-width, card). Hero images also get their
   <link rel="preload"> upgraded to imagesrcset so the preload matches what
   the browser actually picks.
   Idempotent — safe to re-run after adding images. Run before
   generate-sitemap.mjs. */
import fs from 'fs/promises';
import sharp from 'sharp';

const VARIANT_WIDTHS = [800, 1600];
const MIN_SOURCE_WIDTH = 1200;

// sizes by nearest layout container (page margin ≈ 4vw per side → content ≈ 92vw)
const SIZES = {
  'image-grid-4': '(max-width: 640px) 46vw, 23vw',
  'image-grid-3': '(max-width: 640px) 92vw, 31vw',
  'image-grid-2': '(max-width: 640px) 92vw, 46vw',
  'work-grid':    '(max-width: 640px) 92vw, 46vw',
  'project-grid': '(max-width: 640px) 92vw, 46vw',
  'full-image':   '92vw',
  'hero-image':   '100vw',
};

const meta = new Map();
async function imgMeta(src) {
  if (!meta.has(src)) {
    try {
      const m = await sharp(decodeURI(src), { limitInputPixels: false }).metadata();
      meta.set(src, { width: m.width, animated: (m.pages || 1) > 1 });
    } catch { meta.set(src, null); }
  }
  return meta.get(src);
}

async function ensureVariant(src, width) {
  const out = decodeURI(src).replace(/\.(webp|png|jpe?g)$/i, `-w${width}.webp`);
  try { await fs.access(out); } catch {
    await sharp(decodeURI(src), { limitInputPixels: false })
      .resize({ width })
      .webp({ quality: 82, effort: 5 })
      .toFile(out);
  }
  return out;
}

function sizesFor(html, tagIndex) {
  // walk backwards from the tag to the nearest known container class
  const before = html.slice(Math.max(0, tagIndex - 4000), tagIndex);
  let best = null, bestPos = -1;
  for (const cls of Object.keys(SIZES)) {
    const pos = before.lastIndexOf(cls);
    if (pos > bestPos) { bestPos = pos; best = cls; }
  }
  return best ? SIZES[best] : '92vw';
}

const files = (await fs.readdir('.')).filter(f => f.endsWith('.html'));
let tagged = 0, variants = 0, skippedAnimated = 0;

for (const f of files) {
  let src = await fs.readFile(f, 'utf8');
  const tags = [...src.matchAll(/<img\b[^>]*>/g)];
  const edits = [];
  for (const m of tags) {
    const tag = m[0];
    if (/\bsrcset=/.test(tag)) continue;
    const imgSrc = tag.match(/src="([^"]+)"/)?.[1];
    if (!imgSrc || /^(https?:|data:)/.test(imgSrc) || /\.svg$/i.test(imgSrc)) continue;
    if (/rotation-thumb/.test(tag)) continue; // JS swaps src every ~94ms
    const info = await imgMeta(imgSrc);
    if (!info) continue;
    if (info.animated) { skippedAnimated++; continue; }
    if (info.width < MIN_SOURCE_WIDTH) continue;

    const widths = VARIANT_WIDTHS.filter(w => w < info.width);
    if (!widths.length) continue;
    const entries = [];
    for (const w of widths) { entries.push(`${await ensureVariant(imgSrc, w)} ${w}w`); variants++; }
    entries.push(`${imgSrc} ${info.width}w`);
    const sizes = sizesFor(src, m.index);
    const newTag = tag.replace(/^<img\b/, `<img srcset="${entries.join(', ')}" sizes="${sizes}"`);
    edits.push([tag, newTag, imgSrc, entries.join(', '), sizes]);
  }
  if (!edits.length) continue;
  for (const [tag, newTag] of edits) src = src.replaceAll(tag, newTag);
  // keep hero preloads consistent with the srcset the browser will choose
  for (const [, , imgSrc, srcset, sizes] of edits) {
    const preloadRe = new RegExp(`<link rel="preload" href="${imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" as="image" fetchpriority="high">`);
    src = src.replace(preloadRe,
      `<link rel="preload" as="image" fetchpriority="high" imagesrcset="${srcset}" imagesizes="${sizes}">`);
  }
  await fs.writeFile(f, src);
  tagged += edits.length;
  console.log(`${f}: ${edits.length} imgs`);
}
console.log(`\n${tagged} imgs tagged, ${variants} variant refs, ${skippedAnimated} animated skipped`);
