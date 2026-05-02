import fs from 'fs/promises';

const HTML_FILES = (await fs.readdir('.')).filter(f => f.endsWith('.html'));

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
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

const MARKER = 'http-equiv="Content-Security-Policy"';

let changed = 0;
for (const file of HTML_FILES) {
  const src = await fs.readFile(file, 'utf8');
  if (src.includes(MARKER)) continue;
  // Insert directly after <meta charset="UTF-8">
  const re = /(<meta charset="UTF-8">\n)/;
  if (!re.test(src)) {
    console.log(`  SKIP (no charset anchor): ${file}`);
    continue;
  }
  const out = src.replace(re, `$1${SECURITY_BLOCK}`);
  await fs.writeFile(file, out);
  changed++;
}
console.log(`Injected CSP + Referrer-Policy into ${changed} files`);
