/* Generate sitemap.xml from the pages on disk. A page is included when its
   canonical URL points to itself (excludes redirect stubs, whose canonicals
   point at their replacements) and it isn't the 404 page.
   Run after generate-tag-pages.mjs. */
import fs from 'fs/promises';
import { execFileSync } from 'child_process';

const SITE = 'https://www.claytoncunninghamdesign.com';
const today = new Date().toISOString().slice(0, 10);

// Real last-modified date from git history; uncommitted/new files fall back
// to today. Stamping today's date on every URL each run would dilute the
// freshness signal for pages that haven't changed.
function lastmod(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim();
    return out || today;
  } catch { return today; }
}

// Content images per page for Google Images discovery. Skips srcset variants
// (Google reads the canonical src), icons/logos, and duplicate refs.
function pageImages(src) {
  const seen = new Set();
  for (const m of src.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) {
    const s = m[1];
    if (/^(https?:|data:)/.test(s) || /\.svg$/i.test(s)) continue;
    if (/logo|favicon|icon-/i.test(s)) continue;
    if (/-w\d+\.webp$/.test(s)) continue;
    seen.add(s);
  }
  return [...seen];
}

const entries = [];
let imageCount = 0;
for (const f of (await fs.readdir('.')).filter(f => f.endsWith('.html'))) {
  if (f === '404.html') continue;
  const src = await fs.readFile(f, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;
  const canonical = src.match(/rel="canonical" href="([^"]*)"/)?.[1];
  const own = f === 'index.html' ? `${SITE}/` : `${SITE}/${f}`;
  if (canonical !== own) continue;
  const images = pageImages(src);
  imageCount += images.length;
  entries.push({ loc: own, images, lastmod: lastmod(f) });
}
entries.sort((a, b) => (a.loc === `${SITE}/` ? -1 : b.loc === `${SITE}/` ? 1 : a.loc.localeCompare(b.loc)));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
${e.images.map(i => `    <image:image><image:loc>${SITE}/${encodeURI(i)}</image:loc></image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;
await fs.writeFile('sitemap.xml', xml);
console.log(`sitemap.xml: ${entries.length} URLs, ${imageCount} images`);
