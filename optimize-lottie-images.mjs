import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DIR = path.resolve('animations');
const WEBP_QUALITY = 82;

const FILES = [
  'AT-SPOT-ICON-HP.json',
  'at-icon-details.json',
  'at-cars.json',
  'at-illustrations-background-wide.json',
  'at-illustrations-background-elements.json',
  'spot_icons.json',
  'psx-spot-icons.json',
  'kbb-spot-icons.json',
  'kbb-car-heart.json',
  'at-icon-grid.json',
  'at-icon-labels.json',
];

async function optimizeEmbeddedImages(data) {
  let savings = 0;
  if (!data.assets) return savings;

  for (const asset of data.assets) {
    if (!asset.p || !asset.p.startsWith('data:image/png;base64,')) continue;

    const b64 = asset.p.replace('data:image/png;base64,', '');
    const pngBuf = Buffer.from(b64, 'base64');

    try {
      const webpBuf = await sharp(pngBuf)
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toBuffer();

      if (webpBuf.length < pngBuf.length) {
        const newB64 = 'data:image/webp;base64,' + webpBuf.toString('base64');
        savings += asset.p.length - newB64.length;
        asset.p = newB64;
        asset.u = '';
        asset.e = 1;
      }
    } catch (e) {
      // skip if sharp can't process it
    }
  }
  return savings;
}

let totalBefore = 0, totalAfter = 0;

for (const file of FILES) {
  const full = path.join(DIR, file);
  let src;
  try { src = await fs.readFile(full, 'utf8'); } catch { continue; }
  const sizeBefore = Buffer.byteLength(src);

  const data = JSON.parse(src);
  const imgCount = (data.assets || []).filter(a => a.p?.startsWith('data:image/')).length;

  if (imgCount === 0) {
    console.log(`${file}: no embedded images, skipping`);
    continue;
  }

  await optimizeEmbeddedImages(data);
  const out = JSON.stringify(data);
  const sizeAfter = Buffer.byteLength(out);

  await fs.writeFile(full, out);

  const pct = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
  const kb = (n) => (n / 1024).toFixed(0);
  console.log(`${file}: ${kb(sizeBefore)}K → ${kb(sizeAfter)}K (${pct}% smaller) [${imgCount} images]`);

  totalBefore += sizeBefore;
  totalAfter += sizeAfter;
}

if (totalBefore > 0) {
  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${mb(totalBefore)}MB → ${mb(totalAfter)}MB (${totalPct}% smaller)`);
}
