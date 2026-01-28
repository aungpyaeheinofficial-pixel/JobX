import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS = ['001_initial_schema.sql', '002_extended_schema.sql'];

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    for (const file of MIGRATIONS) {
      const path = join(__dirname, file);
      if (!fs.existsSync(path)) continue;
      await client.query('BEGIN');
      console.log(`🔄 Running ${file}...`);
      const migrationSQL = fs.readFileSync(path, 'utf8');
      await client.query(migrationSQL);
      await client.query('COMMIT');
      console.log(`✅ ${file} completed`);
    }
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);
