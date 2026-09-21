const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const fallbackAdmins = require('../data/adminsSeed');

const useFallback = !process.env.DATABASE_URL;

exports.list = async (req, res, next) => {
  try {
    if (useFallback) {
      return res.json({ message: 'ok', data: fallbackAdmins.map(({ password_hash, ...a }) => a) });
    }
    const { rows } = await pool.query('SELECT id, username, created_at FROM admins ORDER BY created_at ASC');
    res.json({ message: 'ok', data: rows });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const hash = await bcrypt.hash(password, 10);

    if (useFallback) {
      if (fallbackAdmins.some((a) => a.username === username)) {
        return res.status(409).json({ message: 'Ce nom d\'utilisateur existe déjà' });
      }
      const nextId = fallbackAdmins.reduce((max, a) => Math.max(max, a.id), 0) + 1;
      const admin = { id: nextId, username, password_hash: hash, created_at: new Date().toISOString() };
      fallbackAdmins.push(admin);
      const { password_hash, ...safe } = admin;
      return res.status(201).json({ message: 'ok', data: safe });
    }

    try {
      const { rows } = await pool.query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
        [username, hash]
      );
      res.status(201).json({ message: 'ok', data: rows[0] });
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ message: "Ce nom d'utilisateur existe déjà" });
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.admin.id)) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    if (useFallback) {
      if (fallbackAdmins.length <= 1) {
        return res.status(400).json({ message: 'Impossible de supprimer le dernier compte admin' });
      }
      const idx = fallbackAdmins.findIndex((a) => String(a.id) === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Admin introuvable' });
      fallbackAdmins.splice(idx, 1);
      return res.json({ message: 'ok' });
    }

    const { rows: countRows } = await pool.query('SELECT COUNT(*)::int AS n FROM admins');
    if (countRows[0].n <= 1) {
      return res.status(400).json({ message: 'Impossible de supprimer le dernier compte admin' });
    }
    const { rowCount } = await pool.query('DELETE FROM admins WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Admin introuvable' });
    res.json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
};
