const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.DATABASE_PUBLIC_URL
    || (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE
        ? `postgresql://${encodeURIComponent(process.env.PGUSER)}${process.env.PGPASSWORD ? `:${encodeURIComponent(process.env.PGPASSWORD)}` : ''}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`
        : null);

  if (!connectionString) throw new Error('DATABASE_URL or POSTGRES_URL is required');
  const isNoSsl = connectionString.includes('localhost')
    || connectionString.includes('127.0.0.1')
    || connectionString.includes('railway.internal')
    || connectionString.includes('sslmode=disable');

  const client = new Client({
    connectionString,
    ssl: isNoSsl ? false : { rejectUnauthorized: false }
  });
  await client.connect();
  await client.query(fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8'));
  await client.end();
  console.log('PDDR PostgreSQL schema is ready.');
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
