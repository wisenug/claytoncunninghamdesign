/* Branded 1200×630 OG cards for project + capability pages, rendered with
   puppeteer from the manifest's ink colors and the site's own fonts.
   Outputs img/og/og-<page>.jpg and updates each page's og:image/twitter:image.
   Requires the dev server on :3000 (for fonts/ and img/). Re-run after
   adding a project or changing labels. */
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

const SITE = 'https://www.claytoncunninghamdesign.com';
const shim = {};
new Function('window', await fs.readFile('js/projects.js', 'utf8'))(shim);
const { CCD_PROJECTS, CCD_TAG_META, CCD_TAG_HREF } = shim;

await fs.mkdir('img/og', { recursive: true });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function cardHtml({ bg, fg, kicker, title, image }) {
  // long labels get smaller type so they never collide with the footer
  const titleSize = title.length <= 30 ? 68 : title.length <= 55 ? 54 : 44;
  return `<!doctype html><html><head>
  <style>
    @font-face { font-family:'DM Sans'; font-style:normal; font-weight:300 800; font-display:block;
      src:url(http://localhost:3000/fonts/dm-sans-04.woff2) format('woff2'); }
    @font-face { font-family:'Playfair Display'; font-style:italic; font-weight:400; font-display:block;
      src:url(http://localhost:3000/fonts/playfair-display-08.woff2) format('woff2'); }
    * { margin:0; box-sizing:border-box; }
    body { width:1200px; height:630px; background:${bg}; font-family:'DM Sans',sans-serif;
      display:flex; overflow:hidden; position:relative; }
    .text { flex:1 1 54%; padding:72px 24px 64px 72px; display:flex; flex-direction:column; z-index:2; }
    .kicker { font-size:26px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
      color:${fg}; opacity:.62; }
    .title { margin-top:26px; font-size:${titleSize}px; line-height:1.12; font-weight:800;
      letter-spacing:-.03em; color:${fg}; }
    .footer { margin-top:auto; display:flex; align-items:baseline; gap:14px; }
    .name { font-size:27px; font-weight:700; letter-spacing:-.01em; color:${fg}; }
    .amp { font-family:'Playfair Display',serif; font-style:italic; font-size:25px; color:${fg}; opacity:.75; }
    .img { flex:1 1 46%; position:relative; z-index:1; }
    .img img { width:100%; height:100%; object-fit:cover; }
    .img::after { content:''; position:absolute; inset:0;
      background:linear-gradient(90deg, ${bg} 0%, transparent 22%); }
  </style></head><body>
    <div class="text">
      <div class="kicker">${esc(kicker)}</div>
      <div class="title">${esc(title)}</div>
      <div class="footer"><span class="name">Clayton Cunningham</span><span class="amp">Designer &amp; Illustrator</span></div>
    </div>
    ${image ? `<div class="img"><img src="http://localhost:3000/${image}"></div>` : ''}
  </body></html>`;
}

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

async function render(outName, opts) {
  await page.setContent(cardHtml(opts), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const out = `img/og/${outName}`;
  await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
  return out;
}

async function updateMeta(file, ogPath) {
  let src = await fs.readFile(file, 'utf8');
  const url = `${SITE}/${ogPath}`;
  src = src.replace(/(property="og:image" content=")[^"]*(")/, `$1${url}$2`);
  src = src.replace(/(name="twitter:image" content=")[^"]*(")/, `$1${url}$2`);
  await fs.writeFile(file, src);
}

for (const p of CCD_PROJECTS.filter(p => !p.homeOnly)) {
  const out = await render(`og-${p.href.replace('.html', '')}.jpg`, {
    bg: p.bgColor, fg: p.fgColor, kicker: p.client, title: p.label || p.title, image: p.image,
  });
  await updateMeta(p.href, out);
  console.log(`${p.href} → ${out}`);
}

for (const tag of Object.keys(CCD_TAG_META)) {
  const file = CCD_TAG_HREF(tag);
  const sample = CCD_PROJECTS.find(p => !p.homeOnly && p.tags.includes(tag));
  const out = await render(`og-${file.replace('.html', '')}.jpg`, {
    bg: '#0B2D52', fg: '#B8D9F5', kicker: 'Capabilities', title: CCD_TAG_META[tag].title, image: sample?.image,
  });
  await updateMeta(file, out);
  console.log(`${file} → ${out}`);
}

await browser.close();
console.log('done');
