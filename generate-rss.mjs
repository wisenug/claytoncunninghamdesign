/* Generate feed.xml (RSS 2.0) for the process write-ups, from
   js/projects.js's CCD_ARTICLES and each page's own meta tags. Re-run
   after adding a new write-up. Part of the generator pipeline — see
   README-less convention: run alongside generate-tag-pages.mjs,
   inject-schema.mjs, generate-sitemap.mjs. */
import fs from 'fs/promises';

const SITE = 'https://www.claytoncunninghamdesign.com';

const shim = {};
new Function('window', await fs.readFile('js/projects.js', 'utf8'))(shim);
const { CCD_ARTICLES } = shim;

const grab = (src, re) => src.match(re)?.[1] ?? '';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const items = [];
for (const [file, pubDate] of Object.entries(CCD_ARTICLES)) {
  const src = await fs.readFile(file, 'utf8');
  const title = grab(src, /<title>([^<]*)<\/title>/).replace(/ [—–•-] Clayton Cunningham.*$/, '');
  const description = grab(src, /name="description" content="([^"]*)"/);
  const canonical = grab(src, /rel="canonical" href="([^"]*)"/);
  items.push({ title, description, url: canonical, pubDate: new Date(pubDate + 'T12:00:00Z').toUTCString() });
}
// Newest first
items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Clayton Cunningham Design • Process Notes</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Process write-ups on illustration systems, iconography, and product design from Clayton Cunningham.</description>
    <language>en-us</language>
${items.map(i => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <description>${esc(i.description)}</description>
      <pubDate>${i.pubDate}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;
await fs.writeFile('feed.xml', rss);
console.log(`feed.xml: ${items.length} items`);
