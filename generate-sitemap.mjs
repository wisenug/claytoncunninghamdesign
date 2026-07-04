/* Generate sitemap.xml from the pages on disk. A page is included when its
   canonical URL points to itself (excludes redirect stubs, whose canonicals
   point at their replacements) and it isn't the 404 page.
   Run after generate-tag-pages.mjs. */
import fs from 'fs/promises';

const SITE = 'https://www.claytoncunninghamdesign.com';
const today = new Date().toISOString().slice(0, 10);

const urls = [];
for (const f of (await fs.readdir('.')).filter(f => f.endsWith('.html'))) {
  if (f === '404.html') continue;
  const src = await fs.readFile(f, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;
  const canonical = src.match(/rel="canonical" href="([^"]*)"/)?.[1];
  const own = f === 'index.html' ? `${SITE}/` : `${SITE}/${f}`;
  if (canonical !== own) continue;
  urls.push(own);
}
urls.sort((a, b) => (a === `${SITE}/` ? -1 : b === `${SITE}/` ? 1 : a.localeCompare(b)));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
await fs.writeFile('sitemap.xml', xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
