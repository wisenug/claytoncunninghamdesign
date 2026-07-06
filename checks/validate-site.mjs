/* Static site validation — run from project root; exits non-zero on failure.
   Checks:
   1. Every local href/src/srcset target in every root HTML file exists on disk
   2. Every JSON-LD block parses
   3. Every sitemap URL maps to a real file whose canonical matches
   4. Every site URL mentioned in llms.txt resolves to a real file
   5. feed.xml is well-formed and every item link resolves
   Used by CI (.github/workflows/checks.yml) and runnable locally. */
import fs from 'fs/promises';
import { existsSync } from 'fs';

const SITE = 'https://www.claytoncunninghamdesign.com';
const errors = [];

const files = (await fs.readdir('.')).filter(f => f.endsWith('.html'));

function checkTarget(page, ref) {
  const clean = decodeURI(ref.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return;
  if (/^(https?:|mailto:|data:|tel:)/.test(ref)) return;
  const target = clean.startsWith('/') ? clean.slice(1) : clean;
  if (!existsSync(target)) errors.push(`${page}: broken ref → ${ref}`);
}

for (const f of files) {
  const src = await fs.readFile(f, 'utf8');

  // 1. hrefs and srcs
  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) checkTarget(f, m[1]);
  // srcset / imagesrcset entries
  for (const m of src.matchAll(/(?:imagesrcset|srcset)="([^"]+)"/g)) {
    for (const entry of m[1].split(',')) checkTarget(f, entry.trim().split(/\s+/)[0]);
  }

  // 2. JSON-LD parses
  for (const m of src.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${f}: invalid JSON-LD — ${e.message}`); }
  }
}

// 3. sitemap ↔ files ↔ canonicals
const sitemap = await fs.readFile('sitemap.xml', 'utf8');
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = m[1];
  if (url.includes('/img/') || !url.startsWith(SITE)) continue; // image entries checked via refs above
  const rel = url.slice(SITE.length + 1) || 'index.html';
  if (!existsSync(rel)) { errors.push(`sitemap: missing file for ${url}`); continue; }
  const page = await fs.readFile(rel, 'utf8');
  const canonical = page.match(/rel="canonical" href="([^"]*)"/)?.[1];
  if (canonical !== url) errors.push(`sitemap: canonical mismatch for ${rel} (${canonical} ≠ ${url})`);
}

// 4. every site URL mentioned in llms.txt (markdown links or bare URLs)
const llms = await fs.readFile('llms.txt', 'utf8');
for (const m of llms.matchAll(/https:\/\/www\.claytoncunninghamdesign\.com\/([^\s)]*)/g)) {
  if (m[1] && !existsSync(m[1])) errors.push(`llms.txt: missing file for ${m[0]}`);
}

// 5. feed.xml — well-formed and every item link resolves
if (existsSync('feed.xml')) {
  const feed = await fs.readFile('feed.xml', 'utf8');
  if (!feed.includes('<rss') || (feed.match(/<item>/g) || []).length === 0) {
    errors.push('feed.xml: no <item> entries found');
  }
  for (const m of feed.matchAll(/<link>([^<]+)<\/link>/g)) {
    const rel = m[1].startsWith(SITE) ? m[1].slice(SITE.length + 1) || 'index.html' : null;
    if (rel && !existsSync(rel)) errors.push(`feed.xml: missing file for ${m[1]}`);
  }
}

if (errors.length) {
  console.error(`FAIL — ${errors.length} problem(s):`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log(`OK — ${files.length} pages: links, JSON-LD, sitemap, llms.txt all valid`);
