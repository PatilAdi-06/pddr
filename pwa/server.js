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

function getDbConfig() {
  const isCloud = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID || process.env.RENDER || process.env.FLY_APP_NAME);
  
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_PUBLIC_URL
  ].filter(Boolean);

  if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
    const user = encodeURIComponent(process.env.PGUSER);
    const pass = process.env.PGPASSWORD ? `:${encodeURIComponent(process.env.PGPASSWORD)}` : '';
    const host = process.env.PGHOST;
    const port = process.env.PGPORT || 5432;
    const db = process.env.PGDATABASE;
    candidates.push(`postgresql://${user}${pass}@${host}:${port}/${db}`);
  }

  let chosen = null;
  if (isCloud) {
    chosen = candidates.find(url => !url.includes('localhost') && !url.includes('127.0.0.1'));
    if (!chosen && candidates.some(url => url.includes('localhost'))) {
      console.warn('[Cloud Database Warning] Detected DATABASE_URL set to localhost while running on Railway/Cloud! In Railway, change DATABASE_URL to ${{Postgres.DATABASE_URL}}.');
    }
  }

  if (!chosen && candidates.length > 0) {
    chosen = candidates[0];
  }

  if (!chosen) return null;

  const isNoSsl = chosen.includes('localhost')
    || chosen.includes('127.0.0.1')
    || chosen.includes('railway.internal')
    || chosen.includes('sslmode=disable');

  return {
    connectionString: chosen,
    ssl: isNoSsl ? false : { rejectUnauthorized: false }
  };
}

async function autoMigrate() {
  const dbConfig = getDbConfig();
  if (!dbConfig) {
    console.log('[Database] No PostgreSQL connection string found. Running in local/offline fallback mode.');
    return;
  }
  process.env.DATABASE_URL = dbConfig.connectionString;
  try {
    const { Client } = require('pg');
    const client = new Client(dbConfig);
    await client.connect();

    // 1. Run schema migration
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('[Database] PostgreSQL schema verified and migrated successfully.');

    // 2. Check if food dataset needs initial seeding
    try {
      const foodCountRes = await client.query('SELECT COUNT(*) FROM foods');
      if (parseInt(foodCountRes.rows[0].count, 10) === 0) {
        console.log('[Database] Seeding initial Indian Food Nutrition dataset...');
        const csvPath = path.join(__dirname, '..', 'data', 'Indian_Food_Nutrition_Processed.csv');
        if (fs.existsSync(csvPath)) {
          const csvText = fs.readFileSync(csvPath, 'utf8');
          const lines = csvText.trim().split(/\r?\n/).slice(1);
          for (const line of lines) {
            const cells = []; let value = ''; let quoted = false;
            for (const char of line) {
              if (char === '"') quoted = !quoted;
              else if (char === ',' && !quoted) { cells.push(value.trim()); value = ''; }
              else value += char;
            }
            cells.push(value.trim());
            if (!cells[0]) continue;
            const name = cells[0].replace(/^"|"$/g, '');
            const cal = Number(cells[1]) || 0;
            const carb = Number(cells[2]) || 0;
            const prot = Number(cells[3]) || 0;
            const fat = Number(cells[4]) || 0;
            const sugar = cells[5] && Number.isFinite(Number(cells[5])) ? Number(cells[5]) : null;
            const fibre = Number(cells[6]) || 0;
            const sodium = cells[7] && Number.isFinite(Number(cells[7])) ? Number(cells[7]) : null;
            const dType = /chicken|mutton|fish|meat|egg/i.test(name) ? 'Non-Vegetarian' : (/milk|paneer|curd|cheese|ghee|butter/i.test(name) ? 'Vegetarian' : 'Vegan');
            await client.query(`INSERT INTO foods (name, calories, carbohydrates, protein, fat, free_sugar_g, fibre, sodium_mg, dietary_type)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (name) DO NOTHING`,
              [name, cal, carb, prot, fat, sugar, fibre, sodium, dType]);
          }
          console.log('[Database] Indian Food Nutrition dataset seeded successfully.');
        }
      }
    } catch (e) {
      console.warn('[Database] Food seeding notice:', e.message);
    }

    // 3. Ensure default admin user exists
    try {
      const adminCount = await client.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
      if (parseInt(adminCount.rows[0].count, 10) === 0) {
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = `${salt}:${crypto.scryptSync('Password123!', salt, 64).toString('hex')}`;
        await client.query(`INSERT INTO users (id, email, name, password_hash, role, status)
          VALUES ($1, $2, $3, $4, 'admin', 'active')
          ON CONFLICT (email) DO NOTHING`,
          [crypto.randomUUID(), 'admin@daylight.local', 'Daylight Admin', hash]);
        console.log('[Database] Default admin account initialized: admin@daylight.local / Password123!');
      }
    } catch (e) {
      console.warn('[Database] Admin user check notice:', e.message);
    }

    await client.end();
  } catch (err) {
    console.error('[Database Auto-Migration Notice]:', err.message);
  }
}

server.on('error', (e) => console.error('Server error:', e.message));
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`Daylight Wellness PWA is running on 0.0.0.0:${PORT}`);
  await autoMigrate();
  if (typeof startReminderScheduler === 'function') {
    startReminderScheduler();
  }
});
