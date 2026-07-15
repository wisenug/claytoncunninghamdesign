import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const svg = readFileSync(resolve(root, 'img/clayton-cunningham-design-logo.svg'), 'utf8');

// Raster favicons can't adapt to the browser's light/dark theme (only the
// SVG favicon can, via prefers-color-scheme), so they get a navy badge with
// a light mark: legible on both light and dark tab bars.
const NAVY = '#0B2D52';
const LIGHT = '#B8D9F5';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Circular navy badge, light mark, transparent corners.
async function renderBadge(size) {
  const mark = Math.round(size * 0.72);
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent;}
    body{display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;}
    .badge{width:${size}px;height:${size}px;border-radius:50%;background:${NAVY};display:flex;align-items:center;justify-content:center;}
    svg{width:${mark}px;height:${mark}px;display:block;fill:${LIGHT};}
  </style></head><body><div class="badge">${svg}</div></body></html>`, { waitUntil: 'load' });
  return await page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

// Full-bleed navy square for iOS home screens (iOS rounds the corners itself).
async function renderAppleTouch(size) {
  const mark = Math.round(size * 0.68);
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;padding:0;}
    body{display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;background:${NAVY};}
    svg{width:${mark}px;height:${mark}px;display:block;fill:${LIGHT};}
  </style></head><body>${svg}</body></html>`, { waitUntil: 'load' });
  return await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
}

writeFileSync(resolve(root, 'favicon.ico'), await renderBadge(32));
writeFileSync(resolve(root, 'img/apple-touch-icon.png'), await renderAppleTouch(180));
writeFileSync(resolve(root, 'img/icon-192.png'), await renderBadge(192));
writeFileSync(resolve(root, 'img/icon-512.png'), await renderBadge(512));

console.log('wrote: favicon.ico (32), apple-touch-icon.png (180), icon-192.png, icon-512.png');
await browser.close();
