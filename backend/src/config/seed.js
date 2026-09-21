require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./database');

async function seed() {
  const sql = fs.readFileSync(path.join(__dirname, '../../seed.sql'), 'utf8');
  console.log('🌱 Insertion des agences de démonstration...');
  await pool.query(sql);
  console.log('✅ Seed terminé');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Erreur de seed:', err.message);
  process.exit(1);
});
