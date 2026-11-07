import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('400 Bad Request');
    return;
  }
  // Directory URLs serve their index.html, matching GitHub Pages (/, /reba/, /dino/)
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.normalize(path.join(__dirname, urlPath));
  const insideRoot = filePath.startsWith(__dirname + path.sep) || filePath === __dirname;
  const hasDotSegment = path.relative(__dirname, filePath).split(path.sep)
    .some(s => s.startsWith('.') && s !== '.well-known');
  if (!insideRoot || hasDotSegment) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext];
  if (!contentType) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    // Byte-range support: Safari refuses to play <video> without it, and it
    // lets any browser seek. Falls back to a normal 200 for non-range requests.
    const total = stat.size;
    const range = req.headers.range;
    const rangeMatch = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());

    if (rangeMatch) {
      let start = rangeMatch[1] === '' ? null : parseInt(rangeMatch[1], 10);
      let end = rangeMatch[2] === '' ? null : parseInt(rangeMatch[2], 10);
      if (start === null && end === null) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }
      if (start === null) {            // suffix range: last N bytes
        start = Math.max(0, total - end);
        end = total - 1;
      } else if (end === null || end >= total) {
        end = total - 1;
      }
      if (start > end || start >= total) {
        res.writeHead(416, { 'Content-Range': `bytes */${total}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        'Content-Type': contentType,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': total,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
