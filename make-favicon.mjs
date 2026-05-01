import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const svg = readFileSync(resolve(root, 'img/clayton-cunningham-design-logo.svg'), 'utf8');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

async function renderPng(size) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent;}
    body{display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;}
    svg{width:${size}px;height:${size}px;display:block;fill:#0B2D52;}
  </style></head><body>${svg}</body></html>`, { waitUntil: 'load' });
  return await page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

const png32 = await renderPng(32);
const png180 = await renderPng(180);
const png192 = await renderPng(192);
const png512 = await renderPng(512);

writeFileSync(resolve(root, 'favicon.ico'), png32);
writeFileSync(resolve(root, 'img/apple-touch-icon.png'), png180);
writeFileSync(resolve(root, 'img/icon-192.png'), png192);
writeFileSync(resolve(root, 'img/icon-512.png'), png512);

console.log('wrote: favicon.ico (32), apple-touch-icon.png (180), icon-192.png, icon-512.png');
await browser.close();
