import puppeteer from 'puppeteer';

const URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/capabilities.html',
  'http://localhost:3000/autotrader-illustration-system.html',
  'http://localhost:3000/autotrader-icons.html',
  'http://localhost:3000/kbb-icons-illustrations.html',
  'http://localhost:3000/shoe-rotation.html',
  'http://localhost:3000/logos.html',
  'http://localhost:3000/about.html',
  'http://localhost:3000/404.html',
];

const browser = await puppeteer.launch({ headless: 'new' });
let totalViolations = 0;

for (const url of URLS) {
  const page = await browser.newPage();
  const violations = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || /Content Security Policy|CSP|refused to/i.test(text)) {
      violations.push(`[${msg.type()}] ${text}`);
    }
  });
  page.on('pageerror', e => violations.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', req => {
    if (/csp|blocked/i.test(req.failure()?.errorText || '')) {
      violations.push(`[blocked] ${req.url()} — ${req.failure().errorText}`);
    }
  });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  // Wait briefly for any deferred scripts (Lottie, beacon)
  await new Promise(r => setTimeout(r, 1500));
  await page.close();

  console.log(`${url}: ${violations.length === 0 ? 'OK' : violations.length + ' issues'}`);
  for (const v of violations) console.log(`    ${v}`);
  totalViolations += violations.length;
}

await browser.close();
console.log(`\n${totalViolations === 0 ? 'All clean.' : 'Total issues: ' + totalViolations}`);
