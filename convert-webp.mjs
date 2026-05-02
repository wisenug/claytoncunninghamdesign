import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve('img');
const SKIP_DIRS = new Set(['shawn_kemp_reebok']);
const PNG_QUALITY = 82;
const JPG_QUALITY = 80;

let converted = 0, skipped = 0, bytesIn = 0, bytesOut = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(full);
    } else if (e.isFile()) {
      await maybeConvert(full);
    }
  }
}

async function maybeConvert(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;
  const out = file.slice(0, -ext.length) + '.webp';
  const [srcStat, outStat] = await Promise.all([
    fs.stat(file),
    fs.stat(out).catch(() => null),
  ]);
  if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
    skipped++;
    bytesIn += srcStat.size;
    bytesOut += outStat.size;
    return;
  }
  const quality = ext === '.png' ? PNG_QUALITY : JPG_QUALITY;
  await sharp(file).webp({ quality, effort: 5 }).toFile(out);
  const newStat = await fs.stat(out);
  converted++;
  bytesIn += srcStat.size;
  bytesOut += newStat.size;
  if (converted % 25 === 0) {
    process.stdout.write(`  ${converted} converted, ${skipped} skipped\n`);
  }
}

const t0 = Date.now();
await walk(ROOT);
const dt = ((Date.now() - t0) / 1000).toFixed(1);
const mb = (n) => (n / 1024 / 1024).toFixed(1);
const pct = ((1 - bytesOut / bytesIn) * 100).toFixed(1);
console.log(`\nDone in ${dt}s — ${converted} converted, ${skipped} skipped`);
console.log(`Source: ${mb(bytesIn)} MB → WebP: ${mb(bytesOut)} MB (${pct}% smaller)`);
