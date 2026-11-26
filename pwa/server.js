const http = require('http');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { route: apiRoute, startReminderScheduler } = require('./api');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const ROOT = path.resolve(__dirname);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8'
};

process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]:', reason);
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  if (req.url.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS' });
      return res.end();
    }
    Promise.resolve(apiRoute(req, res)).catch((err) => {
      console.error('[API Unhandled Error]:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  let safeUrl = req.url.split('?')[0];
  let safePath = path.normalize(decodeURI(safeUrl)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (safeUrl === '/favicon.ico') {
        const iconPath = path.join(ROOT, 'icons', 'icon-192.png');
        if (fs.existsSync(iconPath)) {
          res.writeHead(200, { 'Content-Type': 'image/png' });
          return fs.createReadStream(iconPath).pipe(res);
        }
        res.writeHead(204);
        return res.end();
      }
      if (safeUrl === '/reset-password/') {
        const queryIdx = req.url.indexOf('?');
        const query = queryIdx >= 0 ? req.url.slice(queryIdx) : '';
        res.writeHead(302, { Location: `/reset-password${query}` });
        return res.end();
      }
      if (safeUrl === '/reset-password') {
        const indexPath = path.join(ROOT, 'index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(indexPath).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); });
    stream.pipe(res);
  });
});

async function autoMigrate() {
  if (!process.env.DATABASE_URL) {
    console.log('[Database] DATABASE_URL is not set. Running without PostgreSQL persistence.');
    return;
  }
  try {
    const { Client } = require('pg');
    const isLocalDb = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocalDb ? false : { rejectUnauthorized: false }
    });
    await client.connect();
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    await client.end();
    console.log('[Database] PostgreSQL schema verified and migrated successfully.');
  } catch (err) {
    console.error('[Database Auto-Migration Notice]:', err.message);
  }
}

server.on('error', (e) => console.error('Server error:', e.message));
server.listen(PORT, async () => {
  console.log(`Daylight Wellness PWA is running at http://localhost:${PORT}`);
  await autoMigrate();
  if (typeof startReminderScheduler === 'function') {
    startReminderScheduler();
  }
});
