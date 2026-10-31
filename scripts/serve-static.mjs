// Serves a static export folder the way minimal hosting does, to test deployment behaviour without a Next server.
//   node scripts/serve-static.mjs <dir> <port> [fallback[=<file>]]
// A path is looked up as a file, as <path>.html and as <path>/index.html. With `fallback`, anything else is answered with /index.html
// (the SPA rewrite in deploy/nginx.conf and deploy/staticwebapp.config.json) or with `<file>` when named; without it, with the 404 page and status 404.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir = 'out', port = '4000', modeArg] = process.argv.slice(2);
const [mode, fallbackFile = 'index.html'] = (modeArg ?? '').split('=');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.png': 'image/png', '.woff2': 'font/woff2' };
const find = (p) => [p, `${p}.html`, path.join(p, 'index.html')].find((f) => fs.existsSync(f) && fs.statSync(f).isFile());

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = find(path.join(dir, url));
    let status = 200;
    if (!file) {
      status = mode === 'fallback' ? 200 : 404;
      file = mode === 'fallback' ? path.join(dir, fallbackFile) : path.join(dir, '404.html');
    }
    res.writeHead(status, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(Number(port), () => console.log(`serving ${dir} on ${port}${modeArg ? ` (${modeArg})` : ''}`));
