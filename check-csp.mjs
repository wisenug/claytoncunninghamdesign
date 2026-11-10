/* Headless-Chrome check for every page: it must load, run without JavaScript
   errors, fetch all of its own files, and stay inside the CSP.
   Needs the dev server running (node serve.mjs).

   Fails the run on:
     - a page that doesn't load (navigation error, or HTTP 400+)
     - an uncaught JavaScript error
     - a same-origin file that 404s or fails to load
     - a console error that isn't the analytics beacon
     - any CSP violation
   Tolerated: the Cloudflare analytics beacon, which always fails against
   localhost. Redirect stubs carry no scripts and leave the site as soon as
   they load, so they only get an HTTP status check. */
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

const ORIGIN = 'http://localhost:3000';
const IGNORE = /cloudflareinsights\.com/;

const pages = [];
const stubs = [];
for (const f of (await fs.readdir('.')).filter(f => f.endsWith('.html')).sort()) {
  const html = await fs.readFile(f, 'utf8');
  const url = `${ORIGIN}/${f === 'index.html' ? '' : f}`;
  (/http-equiv="refresh"/i.test(html) ? stubs : pages).push(url);
}
pages.push(`${ORIGIN}/dino/`, `${ORIGIN}/reba/`);

let failures = 0;
let cspViolations = 0;

for (const url of stubs) {
  let problem = null;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    if (res.status !== 200) problem = `[HTTP] ${res.status}`;
  } catch (e) {
    problem = `[fetch] ${e.message}`;
  }
  if (problem) { failures++; console.log(`${url}: ${problem}`); }
}
console.log(`${stubs.length} redirect stubs: status checked`);

// GitHub Actions runners lack a usable Chromium sandbox; --no-sandbox is
// safe there (ephemeral, isolated VM) but stays off for local runs.
const browser = await puppeteer.launch({
  headless: true,
  args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
});

for (const url of pages) {
  const page = await browser.newPage();
  const fatal = [];     // fail the run
  const tolerated = []; // reported only
  const isCsp = text => /Content Security Policy|refused to/i.test(text);

  page.on('console', msg => {
    const text = msg.text();
    if (isCsp(text)) { cspViolations++; fatal.push(`[csp] ${text}`); return; }
    if (msg.type() !== 'error') return;
    const where = msg.location()?.url || '';
    (IGNORE.test(text) || IGNORE.test(where) ? tolerated : fatal).push(`[console] ${text}${where ? ` (${where})` : ''}`);
  });
  page.on('pageerror', e => fatal.push(`[pageerror] ${e.message}`));
  page.on('response', res => {
    if (res.status() >= 400 && res.url().startsWith(ORIGIN)) {
      fatal.push(`[HTTP ${res.status()}] ${res.url()}`);
    }
  });
  page.on('requestfailed', req => {
    const reason = req.failure()?.errorText || '';
    if (/csp|blocked/i.test(reason)) {
      cspViolations++;
      fatal.push(`[blocked] ${req.url()} (${reason})`);
    } else if (req.url().startsWith(ORIGIN) && !/ERR_ABORTED/.test(reason)) {
      // ERR_ABORTED is the browser cancelling its own request (a video
      // range request, a navigation), not a broken file.
      fatal.push(`[failed] ${req.url()} (${reason})`);
    }
  });

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    if (!response || response.status() >= 400) {
      fatal.push(`[HTTP] ${response?.status() ?? 'no response'}`);
    }
    // Wait briefly for any deferred scripts (Lottie, beacon)
    await new Promise(r => setTimeout(r, 1500));
  } catch (e) {
    fatal.push(`[navigation] ${e.message}`);
  }
  await page.close();

  // A missing file shows up as both a response and a console error
  const unique = [...new Set(fatal)];
  console.log(`${url}: ${unique.length ? unique.length + ' issues' : 'OK'}`);
  for (const v of unique) console.log(`    ${v}`);
  if (tolerated.length) console.log(`    (tolerated: ${tolerated.length} analytics beacon errors)`);
  failures += unique.length;
}

await browser.close();
console.log(`\n${failures === 0 ? 'All clean.' : 'Failures: ' + failures} (${pages.length} pages, ${stubs.length} stubs, CSP violations: ${cspViolations})`);
if (failures > 0) process.exit(1);
