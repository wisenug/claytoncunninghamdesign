/* AVIF versions of the site's larger images, served through <picture>.

   Every <img> that delivers WebP files (src plus srcset) is treated as a group.
   For each group whose biggest file is 60 KB or more, an .avif sits next to
   every .webp, and the <img> is wrapped:
     <picture><source type="image/avif" srcset="…" sizes="…"><img …></picture>
   Browsers without AVIF ignore the <source> and load the WebP as before. The
   <img> keeps all its attributes, so layout, lazy loading and alt text don't
   change (styles.css gives <picture> display: contents).

   Quality is the point, so AVIFs are encoded from the ORIGINAL PNG/JPG, not
   from the WebP (re-compressing a lossy file stacks the losses). Originals live
   outside the repo; pass their folder with --originals (default
   ~/Desktop/ccd-originals, mirroring the repo's folder layout). A group with
   no original is left alone.

   Each AVIF is checked against the WebP it would replace. Both are scored with
   SSIM against the original (all three colour channels). If the AVIF scores
   lower, it is re-encoded at a higher quality; if it still scores lower, or the
   group saves less than 10%, the whole group stays WebP. So a conversion never
   makes an image look worse than what's live today.

   Hero images with a <link rel="preload" as="image"> get their preload pointed
   at the AVIF files (type="image/avif"), otherwise AVIF browsers would
   download both formats.

   Idempotent: AVIFs newer than their WebP are reused, wrapped <img>s are
   skipped. Safe to re-run after adding images.

   Order after adding an image:
     convert-webp → swap-html-to-webp → generate-srcset → generate-avif →
     embed-image-credits → generate-sitemap

   Usage: node generate-avif.mjs [--originals DIR] [--dry-run] [--markup-only]
                                 [--force] [--only SUBSTRING] [--shard N/M] */
import fs from 'fs/promises';
import { existsSync, statSync } from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

const ORIG = path.resolve((opt('--originals') ?? '~/Desktop/ccd-originals').replace(/^~/, os.homedir()));
const DRY = flag('--dry-run');
const MARKUP_ONLY = flag('--markup-only');
const FORCE = flag('--force');
const ONLY = opt('--only');
const SHARD = (opt('--shard') ?? '').split('/').map(Number); // e.g. 0/2: encode every 2nd group (run shards in parallel, then --markup-only)

const MIN_GROUP_BYTES = 60 * 1024;   // skip groups whose largest file is smaller
const QUALITY = 54;                  // first attempt
const RETRY_QUALITY = 60;            // if the first attempt scores below the WebP
const MIN_SAVING = 0.10;             // group must shrink by at least this much
const EFFORT = 4;
const CHROMA = '4:2:0';

sharp.concurrency(1);

const pages = (await fs.readdir('.')).filter(f => f.endsWith('.html'));

/* ---------- parsing ---------- */

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;

function pictureRanges(src) {
  return [...src.matchAll(/<picture\b[\s\S]*?<\/picture>/g)].map(m => [m.index, m.index + m[0].length]);
}

/* The files an <img> can deliver, or null if it isn't a WebP-only image. */
function imgEntries(tag) {
  const srcset = attr(tag, 'srcset');
  const raw = srcset
    ? srcset.split(',').map(s => s.trim()).filter(Boolean)
    : (attr(tag, 'src') ? [attr(tag, 'src')] : []);
  if (!raw.length) return null;
  const entries = raw.map(e => {
    const [url, desc] = e.split(/\s+/);
    return { url, desc, file: decodeURI(url) };
  });
  if (!entries.every(e => /\.webp$/i.test(e.file) && /^(img|unused)\//.test(e.file))) return null;
  if (entries.some(e => e.file.startsWith('img/shoes/') || !existsSync(e.file))) return null;
  return entries;
}

const groupKey = entries => entries.map(e => e.file).sort().join('|');
const avifOf = f => f.replace(/\.webp$/i, '.avif');

const groups = new Map(); // key -> { files, status, reason }
for (const page of pages) {
  const src = await fs.readFile(page, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;
  const ranges = pictureRanges(src);
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    if (ranges.some(([a, b]) => m.index >= a && m.index < b)) continue;
    const entries = imgEntries(m[0]);
    if (!entries) continue;
    const key = groupKey(entries);
    if (!groups.has(key)) groups.set(key, { files: [...new Set(entries.map(e => e.file))], status: 'pending', reason: '' });
  }
}

/* ---------- SSIM (7x7 uniform window, sample covariance, per channel) ---------- */

function boxSum(w, h, get) {
  const ow = w - 6, oh = h - 6;
  const tmp = new Float32Array(ow * h);
  for (let y = 0; y < h; y++) {
    let s = 0;
    const row = y * w;
    for (let x = 0; x < 7; x++) s += get(row + x);
    tmp[y * ow] = s;
    for (let x = 1; x < ow; x++) { s += get(row + x + 6) - get(row + x - 1); tmp[y * ow + x] = s; }
  }
  const out = new Float32Array(ow * oh);
  for (let x = 0; x < ow; x++) {
    let s = 0;
    for (let y = 0; y < 7; y++) s += tmp[y * ow + x];
    out[x] = s;
    for (let y = 1; y < oh; y++) { s += tmp[(y + 6) * ow + x] - tmp[(y - 1) * ow + x]; out[y * ow + x] = s; }
  }
  return out;
}

function ssimChannel(a, b, w, h) {
  const N = 49, C1 = (0.01 * 255) ** 2, C2 = (0.03 * 255) ** 2;
  const sa = boxSum(w, h, i => a[i]);
  const sb = boxSum(w, h, i => b[i]);
  const saa = boxSum(w, h, i => a[i] * a[i]);
  const sbb = boxSum(w, h, i => b[i] * b[i]);
  const sab = boxSum(w, h, i => a[i] * b[i]);
  let total = 0;
  for (let i = 0; i < sa.length; i++) {
    const ma = sa[i] / N, mb = sb[i] / N;
    const va = (saa[i] / N - ma * ma) * N / (N - 1);
    const vb = (sbb[i] / N - mb * mb) * N / (N - 1);
    const vab = (sab[i] / N - ma * mb) * N / (N - 1);
    total += ((2 * ma * mb + C1) * (2 * vab + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
  }
  return total / sa.length;
}

function ssimRGB(refBuf, testBuf, w, h) {
  let sum = 0;
  for (let c = 0; c < 3; c++) {
    const a = new Uint8Array(w * h), b = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) { a[i] = refBuf[i * 3 + c]; b[i] = testBuf[i * 3 + c]; }
    sum += ssimChannel(a, b, w, h);
  }
  return sum / 3;
}

const rgb = async input => {
  const { data, info } = await sharp(input).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};

/* ---------- encoding ---------- */

function findOriginal(webp) {
  const dir = path.dirname(webp);
  const stem = path.basename(webp, '.webp').replace(/-w\d+$/, '');
  for (const ext of ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']) {
    const p = path.join(ORIG, dir, `${stem}.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

async function encodeMember(webp, original) {
  const meta = await sharp(webp).metadata();
  if ((meta.pages ?? 1) > 1) return { skip: 'animated' };
  const { width: w, height: h } = meta;
  const resized = () => sharp(original).resize(w, h, { fit: 'fill' });
  const ref = await rgb(await resized().png().toBuffer());
  if (ref.w !== w || ref.h !== h) return { skip: 'size mismatch' };
  const om = await sharp(original).metadata();
  if (Math.abs(om.width / om.height - w / h) > 0.01) return { skip: 'original has a different aspect ratio' };

  const webpScore = ssimRGB(ref.data, (await rgb(webp)).data, w, h);
  const webpBytes = statSync(webp).size;
  let last = null;
  for (const q of [QUALITY, RETRY_QUALITY]) {
    const buf = await resized().avif({ quality: q, chromaSubsampling: CHROMA, effort: EFFORT }).toBuffer();
    const score = ssimRGB(ref.data, (await rgb(buf)).data, w, h);
    last = { buf, q, score, webpScore, webpBytes };
    if (score >= webpScore) return last;
  }
  return { ...last, skip: `scores below the WebP (${last.score.toFixed(4)} < ${last.webpScore.toFixed(4)}) even at q${RETRY_QUALITY}` };
}

async function processGroup(g, label) {
  const biggest = Math.max(...g.files.map(f => statSync(f).size));
  if (biggest < MIN_GROUP_BYTES) { g.status = 'skip'; g.reason = 'small'; return; }
  if (ONLY && !g.files.some(f => f.includes(ONLY))) { g.status = 'skip'; g.reason = 'not selected'; return; }

  const originals = g.files.map(findOriginal);
  if (originals.some(o => !o)) { g.status = 'skip'; g.reason = 'no original found'; return; }

  const fresh = g.files.every(f => existsSync(avifOf(f)) && statSync(avifOf(f)).mtimeMs >= statSync(f).mtimeMs);
  if (fresh && !FORCE) { g.status = 'ok'; g.reason = 'already generated'; return; }
  if (DRY) { g.status = 'skip'; g.reason = 'dry run (would encode)'; return; }

  const results = [];
  for (let i = 0; i < g.files.length; i++) results.push(await encodeMember(g.files[i], originals[i]));
  const bad = results.find(r => r.skip);
  if (bad) { g.status = 'skip'; g.reason = bad.skip; console.log(`${label} skip  ${path.basename(g.files[0])}: ${bad.skip}`); return; }

  const before = results.reduce((s, r) => s + r.webpBytes, 0);
  const after = results.reduce((s, r) => s + r.buf.length, 0);
  if (after > before * (1 - MIN_SAVING)) {
    g.status = 'skip'; g.reason = `saves only ${Math.round((1 - after / before) * 100)}%`;
    console.log(`${label} skip  ${path.basename(g.files[0])}: ${g.reason}`);
    return;
  }
  for (let i = 0; i < g.files.length; i++) await fs.writeFile(avifOf(g.files[i]), results[i].buf);
  g.status = 'ok'; g.reason = 'encoded'; g.before = before; g.after = after;
  const qs = [...new Set(results.map(r => 'q' + r.q))].join('/');
  const worst = Math.min(...results.map(r => r.score - r.webpScore));
  console.log(`${label} ok    ${path.basename(g.files[0]).padEnd(46)} ${(before / 1024).toFixed(0).padStart(6)}K → ${(after / 1024).toFixed(0).padStart(6)}K  (-${Math.round((1 - after / before) * 100)}%)  ${qs}  quality margin +${worst.toFixed(4)}`);
}

if (!MARKUP_ONLY) {
  console.log(`${groups.size} image groups across ${pages.length} pages; originals: ${ORIG}`);
  if (!existsSync(ORIG)) console.log('  (originals folder not found: groups will be skipped; pass --originals DIR)');
  let i = 0;
  for (const g of groups.values()) {
    i++;
    if (SHARD.length === 2 && (i % SHARD[1]) !== SHARD[0]) { g.status = 'skip'; g.reason = 'other shard'; continue; }
    await processGroup(g, `[${i}/${groups.size}]`);
  }
} else {
  for (const g of groups.values()) {
    const ok = g.files.every(f => existsSync(avifOf(f)));
    g.status = ok ? 'ok' : 'skip'; g.reason = ok ? 'files present' : 'no avif files';
  }
}

/* ---------- markup ---------- */

let wrapped = 0, preloads = 0, pagesChanged = 0;
const unmatchedPreloads = [];
for (const page of pages) {
  let src = await fs.readFile(page, 'utf8');
  if (src.includes('http-equiv="refresh"')) continue;
  const ranges = pictureRanges(src);
  const preloadSwaps = [];
  let pageWrapped = 0;

  let out = '';
  let last = 0;
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    if (ranges.some(([a, b]) => m.index >= a && m.index < b)) continue;
    const entries = imgEntries(m[0]);
    if (!entries) continue;
    const g = groups.get(groupKey(entries));
    if (!g || g.status !== 'ok' || !g.files.every(f => existsSync(avifOf(f)))) continue;

    const srcsetAttr = attr(m[0], 'srcset');
    const avifSrcset = entries.map(e => `${avifOf(e.url)}${e.desc ? ' ' + e.desc : ''}`).join(', ');
    const sizes = attr(m[0], 'sizes');
    const source = `<source type="image/avif" srcset="${avifSrcset}"${sizes ? ` sizes="${sizes}"` : ''}>`;
    out += src.slice(last, m.index) + `<picture>${source}${m[0]}</picture>`;
    last = m.index + m[0].length;
    pageWrapped++;
    if (srcsetAttr) preloadSwaps.push({ webp: srcsetAttr, avif: avifSrcset });
  }
  out += src.slice(last);

  for (const { webp, avif } of preloadSwaps) {
    const re = new RegExp(`(<link rel="preload" as="image"[^>]*?)imagesrcset="${webp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*>)`);
    if (re.test(out)) { out = out.replace(re, `$1imagesrcset="${avif}" type="image/avif"$2`); preloads++; }
  }
  // a preload that still points at WebP while its <img> is now AVIF-first would double-download
  for (const m of out.matchAll(/<link rel="preload" as="image"[^>]*imagesrcset="([^"]+)"[^>]*>/g)) {
    if (!/type="image\/avif"/.test(m[0])) {
      const first = m[1].split(',')[0].trim().split(/\s+/)[0];
      if (/<picture><source type="image\/avif"/.test(out) && out.includes(avifOf(decodeURI(first)).replace(/^/, '')) ) unmatchedPreloads.push(`${page}: ${first}`);
    }
  }

  if (out !== src) {
    wrapped += pageWrapped; pagesChanged++;
    if (!DRY) await fs.writeFile(page, out);
  }
}

/* ---------- summary ---------- */

const ok = [...groups.values()].filter(g => g.status === 'ok');
const skipped = [...groups.values()].filter(g => g.status !== 'ok');
const reasons = {};
for (const g of skipped) reasons[g.reason] = (reasons[g.reason] || 0) + 1;
const enc = ok.filter(g => g.before);
console.log(`\nGroups converted: ${ok.length} of ${groups.size}`);
if (enc.length) {
  const b = enc.reduce((s, g) => s + g.before, 0), a = enc.reduce((s, g) => s + g.after, 0);
  console.log(`This run: ${(b / 1e6).toFixed(1)} MB WebP → ${(a / 1e6).toFixed(1)} MB AVIF (-${Math.round((1 - a / b) * 100)}%)`);
}
console.log(`Left as WebP: ${skipped.length}${skipped.length ? '  (' + Object.entries(reasons).map(([k, v]) => `${v} ${k}`).join(', ') + ')' : ''}`);
console.log(`<img> tags wrapped: ${wrapped} on ${pagesChanged} pages; preloads switched to AVIF: ${preloads}`);
if (unmatchedPreloads.length) console.log(`Preloads still pointing at WebP (check by hand):\n  ${unmatchedPreloads.join('\n  ')}`);
if (DRY) console.log('(dry run: no files written)');
