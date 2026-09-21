require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./database');

const USERNAME = process.env.SEED_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'nita2026';

async function seedAdmin() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  await pool.query(
    `INSERT INTO admins (username, password_hash) VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [USERNAME, hash]
  );
  console.log(`✅ Admin "${USERNAME}" prêt (mot de passe: ${PASSWORD} — à changer en production)`);
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error('❌ Erreur seed admin:', err.message);
  process.exit(1);
});
