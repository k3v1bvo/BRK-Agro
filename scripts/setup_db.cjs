const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:delunoalnueve_19@db.rwnuknrqjolwvvgfandg.supabase.co:5432/postgres';

async function run() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully to database!');

    const sqlPath = path.join(__dirname, '..', 'supabase_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing schema...');
    await client.query(sql);
    console.log('Schema executed successfully!');

    // Check tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Public tables created:', res.rows.map(r => r.table_name));

    await client.end();
    console.log('Done!');
  } catch (err) {
    console.error('Database setup error:', err);
    process.exit(1);
  }
}

run();
