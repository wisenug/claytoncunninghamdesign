/* Embed IPTC/XMP credit + copyright metadata into the image files themselves.

   The JSON-LD in each page only asserts authorship while the image sits on
   that page. Once a file is saved, reposted, or scraped it carries nothing —
   so the same ownership map that drives inject-schema.mjs is written into the
   files, where it travels with them. Google Images reads these fields.

   Ownership is resolved per image by finding which page references it and
   looking up that page's client. Images referenced from pages with different
   owners are reported and skipped rather than guessed at.

   Uses exiftool so pixels are never re-encoded (sharp would decode + re-encode
   every file, costing a generation of quality on already-compressed assets).

   WebStatement points every file at the licensing page, so anyone who opens
   the metadata lands on the terms. LicensorURL is only set on work Clayton can
   actually grant rights to — pointing it at his contact page for client-owned
   work would imply he can license something he doesn't own.

   Usage: node embed-image-credits.mjs [--dry-run] */
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';

const run = promisify(execFile);
const DRY = process.argv.includes('--dry-run');
const CREATOR = 'Clayton Cunningham';
const SITE = 'https://www.claytoncunninghamdesign.com';
const LICENSE_URL = `${SITE}/licensing.html`;

/* Copyright per client, mirroring OWNERSHIP in inject-schema.mjs. */
const RIGHTS = {
  'Autotrader': {
    notice: '© Cox Automotive. All rights reserved.',
    credit: 'Clayton Cunningham / Cox Automotive',
    terms: 'Created by Clayton Cunningham as Senior Product Designer at Cox Automotive. Copyright is held by Cox Automotive.',
  },
  'Kelley Blue Book': {
    notice: '© Cox Automotive. All rights reserved.',
    credit: 'Clayton Cunningham / Cox Automotive',
    terms: 'Created by Clayton Cunningham as Senior Product Designer at Cox Automotive. Copyright is held by Cox Automotive.',
  },
  'Cox Automotive': {
    notice: '© Cox Automotive. All rights reserved.',
    credit: 'Clayton Cunningham / Cox Automotive',
    terms: 'Created by Clayton Cunningham as Senior Product Designer at Cox Automotive. Copyright is held by Cox Automotive.',
  },
  'DICK\'S TSHQ': {
    notice: '© DICK\'S Sporting Goods. All rights reserved.',
    credit: 'Clayton Cunningham / DICK\'S Sporting Goods',
    terms: 'Created by Clayton Cunningham as Product Designer at DICK\'S Team Sports HQ. Copyright is held by DICK\'S Sporting Goods.',
  },
  'Coca-Cola': {
    notice: '© The Coca-Cola Company. All rights reserved.',
    credit: 'Clayton Cunningham / The Coca-Cola Company',
    terms: 'Created by Clayton Cunningham as Designer at The Coca-Cola Company. Copyright is held by The Coca-Cola Company.',
  },
  'Paradesmith': {
    notice: '© Paradesmith. All rights reserved.',
    credit: 'Clayton Cunningham / Paradesmith',
    terms: 'Freelance work created by Clayton Cunningham for Paradesmith. Copyright is held by the client.',
  },
  'Various': {
    notice: 'Copyright held by the respective client. All rights reserved.',
    credit: 'Clayton Cunningham',
    terms: 'Freelance identity work created by Clayton Cunningham. Copyright for each mark is held by the respective client.',
  },
  'Personal': {
    notice: `© ${CREATOR}. All rights reserved.`,
    credit: 'Clayton Cunningham',
    terms: `© ${CREATOR}. All rights reserved. Not licensed for AI or machine-learning training without explicit written permission.`,
  },
};

// Pages that are Clayton's own work but aren't in the project manifest.
const PERSONAL_PAGES = new Set(['just-for-funsies.html', 'shoe-rotation.html']);

const manifestSrc = await fs.readFile('js/projects.js', 'utf8');
const shim = {};
new Function('window', manifestSrc)(shim);
const projects = shim.CCD_PROJECTS.filter(p => !p.homeOnly);
const clientByPage = Object.fromEntries(projects.map(p => [p.href, p.client]));

/* Responsive variants (foo-w800.webp) sit next to the file they came from and
   are what a browser actually downloads, so they need the same credit. */
const onDisk = new Set(
  (await fs.readdir('img', { recursive: true })).map(f => `img/${f}`)
);
function withVariants(img) {
  const m = img.match(/^(.*)(\.[a-z0-9]+)$/i);
  if (!m) return [img];
  const out = [img];
  for (const f of onDisk) {
    if (new RegExp(`^${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-w\\d+${m[2].replace('.', '\\.')}$`).test(f)) out.push(f);
  }
  return out;
}

/* Collect every image a page references, following srcset so the responsive
   variants carry the same credit as the file they were derived from. */
function imagesIn(src) {
  const out = new Set();
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const s = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (s) out.add(decodeURI(s));
    const ss = tag.match(/\bsrcset="([^"]+)"/)?.[1];
    if (ss) for (const part of ss.split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) out.add(decodeURI(url));
    }
  }
  return [...out].filter(u => u.startsWith('img/') && !/\.svg$/i.test(u));
}

const owner = new Map();      // image path -> client key
const conflicts = new Map();  // image path -> Set of client keys

function claim(img, client) {
  if (!onDisk.has(img)) return;
  const prev = owner.get(img);
  if (prev && prev !== client) {
    // 'Various' is the logos catch-all; a dedicated project page knows the real
    // client, so it wins. Any other disagreement is a genuine ambiguity.
    if (prev === 'Various') { owner.set(img, client); return; }
    if (client === 'Various') return;
    if (!conflicts.has(img)) conflicts.set(img, new Set([prev]));
    conflicts.get(img).add(client);
    return;
  }
  owner.set(img, client);
}

/* Card thumbnails and OG cards are referenced from index.html and from meta
   tags rather than from the project page, so they're claimed from the manifest
   directly — otherwise the most-scraped images on the site stay anonymous. */
for (const p of projects) {
  if (p.image) for (const v of withVariants(p.image)) claim(v, p.client);
  const og = `img/og/og-${p.href.replace(/\.html$/, '')}.jpg`;
  claim(og, p.client);
}
// Portrait, the home page's own OG image, and the funsies card, none of which
// belong to a project page.
for (const img of ['img/claytoncunningham-og.jpg', 'img/claytoncunningham.webp', 'img/og-shoe-rotation.jpg']) {
  for (const v of withVariants(img)) claim(v, 'Personal');
}
for (const v of withVariants('img/at_illustration_style_10.png')) claim(v, 'Autotrader');

for (const file of (await fs.readdir('.')).filter(f => f.endsWith('.html'))) {
  const src = await fs.readFile(file, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;

  let client = clientByPage[file];
  if (!client && PERSONAL_PAGES.has(file)) client = 'Personal';
  if (!client) continue;                       // index/about/articles: shared imagery

  for (const img of imagesIn(src)) claim(img, client);
}

for (const img of conflicts.keys()) owner.delete(img);

const byClient = {};
for (const [img, client] of owner) (byClient[client] ??= []).push(img);

console.log('Images resolved per owner:');
for (const [client, list] of Object.entries(byClient)) console.log(`  ${client}: ${list.length}`);
if (conflicts.size) {
  console.log(`\nSkipped ${conflicts.size} image(s) referenced by pages with different owners:`);
  for (const [img, set] of conflicts) console.log(`  ${img} — ${[...set].join(' / ')}`);
}
console.log(`\nTotal to tag: ${owner.size}`);

if (DRY) {
  console.log('\n(dry run — nothing written)');
  process.exit(0);
}

let done = 0, failed = 0;
for (const [client, list] of Object.entries(byClient)) {
  const r = RIGHTS[client];
  if (!r) { console.log(`no rights entry for ${client}, skipping`); continue; }

  // -overwrite_original edits containers in place; pixel data is untouched.
  // Compact=NoPadding drops exiftool's ~2.4KB of XMP filler, which otherwise
  // dwarfs the smallest responsive variants (a 1.4KB thumbnail would grow to
  // 5.5KB). Costs nothing but a full rewrite on any future metadata edit.
  const args = [
    '-overwrite_original', '-q', '-m', '-api', 'Compact=NoPadding',
    `-XMP-dc:Creator=${CREATOR}`,
    `-XMP-dc:Rights=${r.notice}`,
    `-XMP-photoshop:Credit=${r.credit}`,
    `-XMP-photoshop:Source=${SITE}`,
    `-XMP-xmpRights:Marked=True`,
    `-XMP-xmpRights:UsageTerms=${r.terms}`,
    `-XMP-plus:CopyrightOwnerName=${r.credit}`,
    `-XMP-xmpRights:WebStatement=${LICENSE_URL}`,
    `-IPTC:By-line=${CREATOR}`,
    `-IPTC:CopyrightNotice=${r.notice}`,
    `-IPTC:Credit=${r.credit}`,
    `-EXIF:Artist=${CREATOR}`,
    `-EXIF:Copyright=${r.notice}`,
    // Only where Clayton holds the rights; see LicensorURL note at the top.
    ...(client === 'Personal' ? [`-XMP-plus:LicensorURL=${LICENSE_URL}`] : []),
    ...list,
  ];

  try {
    await run('exiftool', args, { maxBuffer: 1024 * 1024 * 64 });
    done += list.length;
    console.log(`tagged ${list.length.toString().padStart(4)}  ${client}`);
  } catch (e) {
    failed += list.length;
    console.log(`FAILED ${client}: ${(e.stderr || e.message).split('\n')[0]}`);
  }
}
console.log(`\nTagged ${done} images${failed ? `, ${failed} failed` : ''}`);
