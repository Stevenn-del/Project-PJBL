const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.task': 'application/octet-stream',
  '.map': 'application/json',
};

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(path.join(ROOT_DIR, reqPath));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head><meta charset="UTF-8"><title>404 Tidak Ditemukan</title></head>
        <body style="font-family: sans-serif; background: #0E1116; color: #F8F3E6; padding: 40px; text-align: center;">
          <h1 style="color: #D4AF37;">404 - Halaman Tidak Ditemukan</h1>
          <p>Halaman <code>${reqPath}</code> tidak tersedia.</p>
          <p><a href="/" style="color: #D4AF37;">Kembali ke Beranda</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  const localIp = getLocalIpAddress();
  console.log('====================================================');
  console.log('   KARSA POTRET — SERVER LOKAL AKTIF');
  console.log('====================================================');
  console.log(`   Komputer Anda:  http://localhost:${PORT}`);
  console.log(`   Teman (Wi-Fi):  http://${localIp}:${PORT}`);
  console.log('----------------------------------------------------');
  console.log(`   Halaman Utama:  http://${localIp}:${PORT}/index.html`);
  console.log(`   Timeline:       http://${localIp}:${PORT}/timeline.html`);
  console.log(`   Wayang Motion:  http://${localIp}:${PORT}/wayang-motion.html`);
  console.log('====================================================');
  console.log('Tekan Ctrl + C di terminal jika ingin menghentikan server.');
});
