// Test server for the perf/behaviour harness (FORHANON.md §9.4): serves a site's public/ folder with the CSP and
// headers from its vercel.json, proxies /api/public/* to a deployed site (read-only GETs, cached in memory) and
// swallows /api/track (204) so tests never pollute analytics. Lets the same harness run against any build.
// Usage: node scripts/perf/server.js <siteRoot> <apiOrigin> [port]
//   e.g. node scripts/perf/server.js . https://hanon-fansite.vercel.app 3200
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const apiOrigin = (process.argv[3] || '').replace(/\/$/, '');
const port = Number(process.argv[4] || 3200);
const publicDir = path.join(root, 'public');
const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
const SKIP = new Set(['cache-control', 'strict-transport-security']);
const cache = new Map();

function headersFor(pathname, res) {
  for (const rule of vercel.headers || []) {
    if (!new RegExp(`^${rule.source}$`).test(pathname)) continue;
    for (const h of rule.headers) if (!SKIP.has(h.key.toLowerCase())) res.setHeader(h.key, h.value);
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  headersFor(url.pathname, res);
  if (url.pathname.startsWith('/api/track')) { res.writeHead(204); return res.end(); }
  if (url.pathname.startsWith('/api/')) {
    if (req.method !== 'GET' || !url.pathname.startsWith('/api/public/') || !apiOrigin) { res.writeHead(404); return res.end(); }
    const key = url.pathname + url.search;
    if (!cache.has(key)) {
      const r = await fetch(apiOrigin + key);
      cache.set(key, { status: r.status, type: r.headers.get('content-type') || 'application/json', body: Buffer.from(await r.arrayBuffer()) });
    }
    const c = cache.get(key);
    res.writeHead(c.status, { 'Content-Type': c.type });
    return res.end(c.body);
  }
  const rel = decodeURIComponent(url.pathname);
  for (const cand of rel.endsWith('/') ? [path.join(rel, 'index.html')] : [rel, `${rel}.html`]) {
    const file = path.normalize(path.join(publicDir, cand));
    if (!file.startsWith(publicDir)) break;
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        return res.end(await readFile(file));
      }
    } catch { /* next */ }
  }
  res.writeHead(404); res.end('not found');
}).listen(port, () => console.log(`perf server: ${root} on http://localhost:${port} (api → ${apiOrigin || 'none'})`));
