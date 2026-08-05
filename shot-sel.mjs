/* Screenshot a page section by CSS selector.
   Waits for webfonts (they change text height, so measuring before they land
   gives stale offsets) and pre-scrolls the page to fire every reveal observer,
   so sections shoot fully faded-in rather than mid-transition.
   Usage: node shot-sel.mjs <url> <selector> <out.png> [padTop] */
import puppeteer from 'puppeteer';

const [url, selector, out, padTop = '80'] = process.argv.slice(2);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => document.fonts.ready);

// Walk the page so IntersectionObserver reveals every section, then return.
await page.evaluate(async () => {
  const step = Math.round(innerHeight * 0.8);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 200));
});

const y = await page.evaluate((sel, pad) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  return Math.max(0, Math.round(el.getBoundingClientRect().top + scrollY - Number(pad)));
}, selector, padTop);

if (y === null) { console.error(`no match for ${selector}`); await browser.close(); process.exit(1); }

await page.evaluate(y => window.scrollTo(0, y), y);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log(`saved ${out} (${selector} @ y=${y})`);
