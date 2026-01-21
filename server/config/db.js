// server/config/db.js
import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  // Render gives us DATABASE_URL, locally you can still use your own .env
  connectionString: process.env.DATABASE_URL || undefined,

  // Render's Postgres requires SSL; local dev usually does not
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
});

export default pool;
