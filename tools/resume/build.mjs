/* STALE: clayton-cunningham-resume.pdf is now the one-page Poppins version
   exported from the design file, with newer copy and no Tools row. This
   script and resume.html still produce the older two-page layout, so running
   it would overwrite the current resume. Update resume.html first.

   Renders tools/resume/resume.html to clayton-cunningham-resume.pdf at the
   repo root. Run with the dev server up (node serve.mjs):
     node tools/resume/build.mjs
   Needs the Bw Modelica fonts installed on this machine. */
import puppeteer from 'puppeteer';

const URL = 'http://localhost:3000/tools/resume/resume.html';
const OUT = new globalThis.URL('../../clayton-cunningham-resume.pdf', import.meta.url).pathname;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(URL, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const missing = await page.evaluate(() => !document.fonts.check('700 12px "Modelica"'));
if (missing) console.warn('Warning: Bw Modelica not found, the PDF will use a fallback font.');
await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('Wrote', OUT);
