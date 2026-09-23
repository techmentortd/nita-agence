const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const fallbackAdmins = require('../data/adminsSeed');

const useFallback = !process.env.DATABASE_URL;

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }

    let admin;
    if (useFallback) {
      admin = fallbackAdmins.find((a) => a.username === username) || null;
    } else {
      const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
      admin = rows[0];
    }

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const zone = admin.zone || null;
    const token = jwt.sign({ id: admin.id, username: admin.username, zone }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ message: 'ok', data: { token, username: admin.username, zone } });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ message: 'ok', data: req.admin });
};
