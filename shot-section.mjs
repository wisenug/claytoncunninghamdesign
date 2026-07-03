import puppeteer from 'puppeteer';

const url = process.argv[2];
const scrollY = parseInt(process.argv[3] || '0', 10);
const out = process.argv[4];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
if (scrollY) await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
