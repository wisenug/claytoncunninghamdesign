import fs from 'fs/promises';
import path from 'path';

const PRECISION = 3;
const DIR = path.resolve('animations');

const USED_FILES = new Set([
  'AT-SPOT-ICON-HP.json',
  'at-icon-details.json',
  'at-icon-grid.json',
  'at-icon-labels.json',
  'at-cars.json',
  'at-illustrations-background-wide.json',
  'at-illustrations-background-elements.json',
  'spot_icons.json',
  'psx-spot-icons.json',
  'kbb-spot-icons.json',
  'kbb-car-heart.json',
]);

function roundNumbers(obj) {
  if (typeof obj === 'number') {
    if (Number.isInteger(obj)) return obj;
    return parseFloat(obj.toFixed(PRECISION));
  }
  if (Array.isArray(obj)) return obj.map(roundNumbers);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = roundNumbers(v);
    }
    return out;
  }
  return obj;
}

let totalBefore = 0, totalAfter = 0;

const entries = (await fs.readdir(DIR)).filter(f => f.endsWith('.json') && USED_FILES.has(f));

for (const file of entries) {
  const full = path.join(DIR, file);
  const src = await fs.readFile(full, 'utf8');
  const sizeBefore = Buffer.byteLength(src);

  const data = JSON.parse(src);
  const optimized = roundNumbers(data);
  const out = JSON.stringify(optimized);
  const sizeAfter = Buffer.byteLength(out);

  await fs.writeFile(full, out);

  const pct = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
  const kb = (n) => (n / 1024).toFixed(0);
  console.log(`${file}: ${kb(sizeBefore)}K → ${kb(sizeAfter)}K (${pct}% smaller)`);

  totalBefore += sizeBefore;
  totalAfter += sizeAfter;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
console.log(`\nTotal: ${mb(totalBefore)}MB → ${mb(totalAfter)}MB (${totalPct}% smaller)`);
