import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const HTML_FILES = (await fs.readdir('.')).filter(f => f.endsWith('.html'));

// Lines containing any of these substrings are left untouched.
// OG/Twitter cards reference exact URLs that scrapers fetch — keep originals.
// Favicons / icons / manifest entries declare type=image/png and must match.
const SKIP_LINE_MARKERS = [
  'og:image',
  'twitter:image',
  'rel="icon"',
  'apple-touch-icon',
  'rel="manifest"',
];

// Match img/...(/...).{png,jpg,jpeg} — base path uses safe chars only,
// so it skips JS template-literal fragments like img/shoes/shoe-${i}.png.
const IMG_RE = /(img\/[A-Za-z0-9_./-]+?)\.(png|jpg|jpeg)/gi;

let totalSwapped = 0;
const filesChanged = [];

for (const file of HTML_FILES) {
  const src = await fs.readFile(file, 'utf8');
  const lines = src.split('\n');
  let fileSwaps = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (SKIP_LINE_MARKERS.some(m => line.includes(m))) continue;
    const newLine = line.replace(IMG_RE, (match, base) => {
      return existsSync(path.resolve(base + '.webp')) ? `${base}.webp` : match;
    });
    if (newLine !== line) {
      fileSwaps += (newLine.match(/\.webp/g) || []).length - (line.match(/\.webp/g) || []).length;
      lines[i] = newLine;
    }
  }

  if (fileSwaps > 0) {
    await fs.writeFile(file, lines.join('\n'));
    filesChanged.push([file, fileSwaps]);
    totalSwapped += fileSwaps;
  }
}

console.log(`Swapped ${totalSwapped} references across ${filesChanged.length} files`);
for (const [f, n] of filesChanged) console.log(`  ${f}: ${n}`);
