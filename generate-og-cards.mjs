/* Branded 1200×630 OG cards for project pages, rendered with
   puppeteer from the manifest's ink colors and the site's own fonts.
   Outputs img/og/og-<page>.jpg and updates each page's og:image/twitter:image,
   plus img/og/og-home.jpg for the homepage (name plus project thumbnails,
   picked in HOME_PROJECTS).
   Requires the dev server on :3000 (for fonts/ and img/). Re-run after
   adding a project or changing labels. */
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

const SITE = 'https://www.claytoncunninghamdesign.com';
const shim = {};
new Function('window', await fs.readFile('js/projects.js', 'utf8'))(shim);
const { CCD_PROJECTS } = shim;

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
  </style></head><body>
    <div class="text">
      <div class="kicker">${esc(kicker)}</div>
      <div class="title">${esc(title)}</div>
      <div class="footer"><span class="name">Clayton Cunningham</span><span class="amp">Designer &amp; Illustrator</span></div>
    </div>
    ${image ? `<div class="img"><img src="http://localhost:3000/${image}"></div>` : ''}
  </body></html>`;
}

// Projects shown on the homepage card, in order (3 columns x 2 rows)
const HOME_PROJECTS = [
  'iris-design-system.html', 'kbb-icons-illustrations.html', 'autotrader-icons.html',
  'sketches-illustrations-doodles.html', 'tshq-fanwear-redesign.html', 'coca-cola-campus-messaging.html',
];

function homeCardHtml({ bg, fg, tiles }) {
  return `<!doctype html><html><head>
  <style>
    @font-face { font-family:'DM Sans'; font-style:normal; font-weight:300 800; font-display:block;
      src:url(http://localhost:3000/fonts/dm-sans-04.woff2) format('woff2'); }
    @font-face { font-family:'Playfair Display'; font-style:italic; font-weight:400; font-display:block;
      src:url(http://localhost:3000/fonts/playfair-display-08.woff2) format('woff2'); }
    * { margin:0; box-sizing:border-box; }
    body { width:1200px; height:630px; background:${bg}; font-family:'DM Sans',sans-serif;
      display:flex; overflow:hidden; }
    .text { flex:0 0 520px; padding:72px 0 64px 72px; display:flex; flex-direction:column; justify-content:center; }
    .name { font-size:76px; line-height:1.02; font-weight:800; letter-spacing:-.035em; color:${fg}; }
    .role { margin-top:22px; font-family:'Playfair Display',serif; font-style:italic; font-size:36px; color:${fg}; opacity:.8; }
    .url { position:absolute; left:72px; bottom:56px; font-size:22px; font-weight:600; letter-spacing:.02em; color:${fg}; opacity:.55; }
    .grid { flex:1; display:grid; grid-template-columns:repeat(3, 196px); gap:16px; align-content:center;
      padding-left:24px; }
    .tile { width:196px; height:196px; border-radius:16px; overflow:hidden; }
    .tile:nth-child(3n+2) { transform:translateY(-48px); }
    .tile img { width:100%; height:100%; object-fit:cover; display:block; }
  </style></head><body>
    <div class="text">
      <div class="name">Clayton<br>Cunningham</div>
      <div class="role">Designer &amp; Illustrator</div>
    </div>
    <div class="url">claytoncunninghamdesign.com</div>
    <div class="grid">${tiles.map(t => `<div class="tile" style="background:${t.bg}"><img src="http://localhost:3000/${t.image}"></div>`).join('')}</div>
  </body></html>`;
}

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
// Fonts are fetched with CORS: give the page the dev server's origin so
// localhost fonts are same-origin (from about:blank they silently fell back).
await page.goto('http://localhost:3000/robots.txt');

async function render(outName, opts, html = cardHtml) {
  await page.setContent(html(opts), { waitUntil: 'load', timeout: 120000 });
  await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]));
  if (!(await page.evaluate(() => document.fonts.check('800 20px "DM Sans"')))) throw new Error(`${outName}: DM Sans did not load`);
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

// Process write-ups (CCD_ARTICLES) get their own cards so a shared link
// shows the article, not the case study it draws from. Colors match the page.
const ARTICLE_CARDS = {
  'how-to-build-a-scalable-illustration-system.html': {
    bg: '#E3F2FF', fg: '#0F2960', image: 'img/at_illustration_style_10.webp',
    title: 'How to Build a Scalable Illustration System',
  },
  'icon-grids-and-optical-corrections.html': {
    bg: '#FF8806', fg: '#001F6E', image: 'img/autotrader_icons_library.webp',
    title: 'Icon Grids and Optical Corrections',
  },
};
for (const [href, a] of Object.entries(ARTICLE_CARDS)) {
  const out = await render(`og-${href.replace('.html', '')}.jpg`, { ...a, kicker: 'Process write-up' });
  await updateMeta(href, out);
  console.log(`${href} → ${out}`);
}

const byHref = Object.fromEntries(CCD_PROJECTS.map(p => [p.href, p]));
const home = await render('og-home.jpg', {
  bg: '#0B2D52', fg: '#ffffff',   // index.html's --color-bg / --color-black
  tiles: HOME_PROJECTS.map(h => ({ bg: byHref[h].bgColor, image: byHref[h].image })),
}, homeCardHtml);
await updateMeta('index.html', home);
console.log(`index.html → ${home}`);

await browser.close();
console.log('done');
