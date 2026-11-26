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
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  if (req.url.startsWith('/api/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
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

    // 3. Ensure default admin users exist
    try {
      const crypto = require('crypto');
      const hashAdminPass = (pwd) => {
        const salt = crypto.randomBytes(16).toString('hex');
        return `${salt}:${crypto.scryptSync(pwd, salt, 64).toString('hex')}`;
      };
      const defaultAdmins = [
        { email: 'admin@daylight.local', name: 'Daylight Admin' },
        { email: 'admin@example.com', name: 'PDDR Admin' }
      ];
      for (const adm of defaultAdmins) {
        const existing = await client.query('SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)', [adm.email]);
        if (!existing.rows[0]) {
          await client.query(`INSERT INTO users (id, email, name, password_hash, role, status)
            VALUES ($1, $2, $3, $4, 'admin', 'active')`,
            [crypto.randomUUID(), adm.email.toLowerCase(), adm.name, hashAdminPass('Admin@12345')]);
        }
      }
      console.log('[Database] Default admin accounts verified (admin@daylight.local / admin@example.com).');
    } catch (e) {
      console.warn('[Database] Admin user check notice:', e.message);
    }

    // 4. Ensure demo users and starter diet plans exist for admin panel
    try {
      const planCountRes = await client.query('SELECT COUNT(*) FROM diet_plans');
      if (parseInt(planCountRes.rows[0].count, 10) === 0) {
        console.log('[Database] Seeding initial diet plans and demo user profiles...');
        const crypto = require('crypto');
        const hashPass = (pwd) => {
          const salt = crypto.randomBytes(16).toString('hex');
          return `${salt}:${crypto.scryptSync(pwd, salt, 64).toString('hex')}`;
        };

        // Ensure demo user exists
        let userRow = (await client.query("SELECT id FROM users WHERE LOWER(email) = 'user@daylight.local'")).rows[0];
        if (!userRow) {
          const uId = crypto.randomUUID();
          await client.query(`INSERT INTO users (id, email, name, password_hash, role, status)
            VALUES ($1, 'user@daylight.local', 'Adarsh Patil', $2, 'user', 'active')
            ON CONFLICT (email) DO NOTHING`,
            [uId, hashPass('Password123!')]);
          userRow = { id: uId };
        }
        const demoUserId = userRow.id;
        await client.query(`INSERT INTO profiles (user_id, age, gender, height_cm, weight_kg, target_weight_kg, activity_level, food_preference, weight_goal, allergies, health_conditions)
          VALUES ($1, 24, 'Male', 174, 68, 65, 'Moderate', 'Vegetarian', 'Maintain', 'None', '')
          ON CONFLICT (user_id) DO NOTHING`, [demoUserId]);

        // Get admin user for assigned_by
        const adminRow = (await client.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")).rows[0];
        const assignedBy = adminRow ? adminRow.id : demoUserId;

        // Load sample foods
        const sampleFoodsRes = await client.query("SELECT name, calories, protein, carbohydrates, fat, dietary_type FROM foods LIMIT 15");
        const sf = sampleFoodsRes.rows.length >= 5 ? sampleFoodsRes.rows : [
          { name: 'Oats Khichdi', calories: 340, protein: 12, carbohydrates: 54, fat: 8, dietary_type: 'Vegetarian' },
          { name: 'Paneer Bhurji', calories: 290, protein: 18, carbohydrates: 8, fat: 21, dietary_type: 'Vegetarian' },
          { name: 'Moong Dal Chilla', calories: 220, protein: 14, carbohydrates: 30, fat: 5, dietary_type: 'Vegetarian' },
          { name: 'Mixed Sprouts Salad', calories: 150, protein: 9, carbohydrates: 22, fat: 2, dietary_type: 'Vegan' },
          { name: 'Vegetable Pulao with Curd', calories: 420, protein: 11, carbohydrates: 68, fat: 12, dietary_type: 'Vegetarian' }
        ];

        const makeSampleDays = (num) => {
          const daysArr = [];
          for (let i = 1; i <= num; i++) {
            const dateStr = new Date(Date.now() + (i - 1) * 86400000).toISOString().slice(0, 10);
            daysArr.push({
              day: i,
              date: dateStr,
              meals: [
                { type: 'Breakfast', foods: [{ name: sf[0].name, calories: Number(sf[0].calories), protein: Number(sf[0].protein), carbohydrates: Number(sf[0].carbohydrates), fats: Number(sf[0].fat), portion: 200, dietaryType: sf[0].dietary_type }] },
                { type: 'Morning Snack', foods: [{ name: sf[1].name, calories: Number(sf[1].calories), protein: Number(sf[1].protein), carbohydrates: Number(sf[1].carbohydrates), fats: Number(sf[1].fat), portion: 150, dietaryType: sf[1].dietary_type }] },
                { type: 'Lunch', foods: [{ name: sf[4].name, calories: Number(sf[4].calories), protein: Number(sf[4].protein), carbohydrates: Number(sf[4].carbohydrates), fats: Number(sf[4].fat), portion: 300, dietaryType: sf[4].dietary_type }] },
                { type: 'Evening Snack', foods: [{ name: sf[3].name, calories: Number(sf[3].calories), protein: Number(sf[3].protein), carbohydrates: Number(sf[3].carbohydrates), fats: Number(sf[3].fat), portion: 120, dietaryType: sf[3].dietary_type }] },
                { type: 'Dinner', foods: [{ name: sf[2].name, calories: Number(sf[2].calories), protein: Number(sf[2].protein), carbohydrates: Number(sf[2].carbohydrates), fats: Number(sf[2].fat), portion: 250, dietaryType: sf[2].dietary_type }] }
              ]
            });
          }
          return daysArr;
        };

        const todayStr = new Date().toISOString().slice(0, 10);
        const next7Str = new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10);
        const next14Str = new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10);

        const days7 = makeSampleDays(7);
        const days14 = makeSampleDays(14);

        // Plan 1: 7-Day Balanced Indian Maintenance Plan
        await client.query(`INSERT INTO diet_plans
          (id, user_id, plan_name, start_date, end_date, number_of_days, weight_goal, food_preference, description, day_date, calorie_target, meals, total_calories, total_protein, total_carbohydrates, total_fat, assigned_by)
          VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8, $9, $4::date, $10, $11, $12, $13, $14, $15, $16)`,
          [crypto.randomUUID(), demoUserId, '7-Day Balanced Maintenance Plan', todayStr, next7Str, 7, 'Maintain', 'Vegetarian', 'Maintain · Moderate · Vegetarian · 68→65 kg · Target 2000 kcal', 2000, JSON.stringify(days7), 1950, 64, 240, 52, assignedBy]);

        // Plan 2: 14-Day High-Protein Weight Loss Plan
        await client.query(`INSERT INTO diet_plans
          (id, user_id, plan_name, start_date, end_date, number_of_days, weight_goal, food_preference, description, day_date, calorie_target, meals, total_calories, total_protein, total_carbohydrates, total_fat, assigned_by)
          VALUES ($1, $2, $3, $4::date, $5::date, $6, $7, $8, $9, $4::date, $10, $11, $12, $13, $14, $15, $16)`,
          [crypto.randomUUID(), demoUserId, '14-Day High-Protein Weight Loss Plan', todayStr, next14Str, 14, 'Lose weight', 'Vegetarian', 'Lose weight · Active · Vegetarian · 75→68 kg · Target 1800 kcal', 1800, JSON.stringify(days14), 1780, 82, 195, 46, assignedBy]);

        console.log('[Database] Initial diet plans seeded successfully.');
      }
    } catch (e) {
      console.warn('[Database] Diet plan seeding notice:', e.message);
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
