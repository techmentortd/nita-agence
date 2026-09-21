// src/config/migrate.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./database');

async function migrate() {
  let client;
  try {
    console.log('🔄 Migration en cours...');
    client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrations = ['001_create_agences.sql', '002_create_admins.sql', '003_add_disponible.sql'];
    const migrationsDir = path.join(__dirname, '../../migrations');

    for (const name of migrations) {
      const { rows } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE name = $1',
        [name]
      );
      if (rows.length) continue;

      const filePath = path.join(migrationsDir, name);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`  → Exécution: ${name}`);
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
    }

    console.log('✅ Migrations terminées');
  } catch (err) {
    console.error('❌ Erreur de migration:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
}

module.exports = migrate;

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
