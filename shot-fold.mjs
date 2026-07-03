import puppeteer from 'puppeteer';

const url = process.argv[2];
const out = process.argv[3];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
