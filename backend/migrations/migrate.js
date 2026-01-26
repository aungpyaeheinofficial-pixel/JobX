import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🔄 Running database migrations...');
    
    // Read migration file
    const migrationSQL = fs.readFileSync(
      join(__dirname, '001_initial_schema.sql'),
      'utf8'
    );
    
    // Execute migration
    await client.query(migrationSQL);
    
    await client.query('COMMIT');
    console.log('✅ Migrations completed successfully!');
    
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
