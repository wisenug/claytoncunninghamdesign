/* Keeps the Content-Security-Policy <meta> on every root page in sync with
   the policy below: inserts it where it's missing and rewrites it where it
   differs, so a policy change here reaches every page on the next run.
   Idempotent. Pass --check to report drift without writing (exits 1).

   Not touched:
   - Redirect stubs (meta refresh, no scripts or assets).
   - dino/ and reba/: standalone pages with their own hand-written policies.

   The policy has to live in a <meta> because GitHub Pages can't send custom
   response headers. That means frame-ancestors, report-uri and sandbox are
   unavailable (browsers ignore them in a meta policy). */
import fs from 'fs/promises';

const HTML_FILES = (await fs.readdir('.')).filter(f => f.endsWith('.html'));

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

const SECURITY_BLOCK =
  `  <meta http-equiv="Content-Security-Policy" content="${CSP}">\n` +
  `  <meta name="referrer" content="strict-origin-when-cross-origin">\n`;

const CSP_TAG = /<meta http-equiv="Content-Security-Policy" content="[^"]*">/;
const CHECK = process.argv.includes('--check');

let inserted = 0, updated = 0;
for (const file of HTML_FILES) {
  const src = await fs.readFile(file, 'utf8');
  if (/http-equiv="refresh"/i.test(src)) continue; // redirect stub
  let out;
  if (CSP_TAG.test(src)) {
    out = src.replace(CSP_TAG, `<meta http-equiv="Content-Security-Policy" content="${CSP}">`);
    if (out === src) continue;
    updated++;
  } else {
    // Insert directly after <meta charset="UTF-8">
    const re = /(<meta charset="UTF-8">\r?\n)/;
    if (!re.test(src)) {
      console.log(`  SKIP (no charset anchor): ${file}`);
      continue;
    }
    out = src.replace(re, `$1${SECURITY_BLOCK}`);
    inserted++;
  }
  console.log(`  ${CHECK ? 'out of date' : 'updated'}: ${file}`);
  if (!CHECK) await fs.writeFile(file, out);
}
console.log(`CSP: ${inserted} inserted, ${updated} ${CHECK ? 'out of date' : 'rewritten'}`);
if (CHECK && inserted + updated > 0) process.exit(1);
