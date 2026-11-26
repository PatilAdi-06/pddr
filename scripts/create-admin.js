const crypto = require('crypto');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

async function main() {
  const [email, password, name = 'PDDR Administrator'] = process.argv.slice(2);
  if (!process.env.DATABASE_URL || !email || !password) {
    throw new Error('Usage: npm run db:create-admin -- <email> <password> [name]');
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(`INSERT INTO users (id, email, name, password_hash, role)
    VALUES ($1, $2, $3, $4, 'admin')
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active'`,
  [crypto.randomUUID(), email.trim().toLowerCase(), name.trim(), hashPassword(password)]);
  await client.end();
  console.log(`Admin account provisioned for ${email.trim().toLowerCase()}.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
