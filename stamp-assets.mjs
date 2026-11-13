#!/usr/bin/env node
/* stamp-assets.mjs: content-hash cache busting for local CSS and JS.

   Rewrites every `?v=` on a local .css / .js reference to the first 10 hex
   characters of the file's SHA-256, so a changed file always gets a new URL
   and an unchanged one keeps its cache. Replaces hand-bumped version strings.

   Covers <script src> / <link href> in the root pages, dino/, reba/ and learn/, plus
   the on-demand Lottie player URL in js/site.js (stamped first, since that
   edit changes site.js's own hash).

   Idempotent: CI runs it and fails if the committed files differ.
   Run it after changing any CSS or JS file: node stamp-assets.mjs */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const hashes = new Map();
async function hashOf(file) {
  if (!hashes.has(file)) {
    const buf = await fs.readFile(file);
    hashes.set(file, crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10));
  }
  return hashes.get(file);
}

const changed = [];
async function stamp(file, re, resolve) {
  const src = await fs.readFile(file, 'utf8');
  let out = '';
  let last = 0;
  for (const m of src.matchAll(re)) {
    const target = resolve(m.groups.path);
    const hash = await hashOf(target).catch(() => {
      throw new Error(`${file}: ${m.groups.path} does not exist`);
    });
    out += src.slice(last, m.index) + m[0].replace(/\?v=[^"']*/, `?v=${hash}`);
    last = m.index + m[0].length;
  }
  out += src.slice(last);
  if (out !== src) {
    await fs.writeFile(file, out);
    changed.push(file);
  }
}

// 1. The Lottie player URL inside site.js
await stamp('js/site.js', /'(?<path>js\/vendor\/[^'?]+\.js)\?v=[^']*'/g, p => p);

// 2. Pages (site.js is hashed only now, after step 1)
const pages = [];
for (const dir of ['.', 'dino', 'reba', 'learn']) {
  for (const f of await fs.readdir(dir)) if (f.endsWith('.html')) pages.push(path.join(dir, f));
}
const ref = /(?:src|href)="(?<path>[^"?:]+\.(?:css|js))\?v=[^"]*"/g;
for (const page of pages) {
  await stamp(page, ref, p => path.join(path.dirname(page), p));
}

console.log(changed.length ? `stamp-assets: updated ${changed.length} file(s)` : 'stamp-assets: up to date');
