const pool = require('../config/database');
const fallbackAgences = require('../data/agencesSeed');
const { ZONE_IDS } = require('../data/zones');

// Sans DATABASE_URL (pas de DB locale), on sert le jeu de données de secours
// pour que le frontend reste utilisable en développement.
const useFallback = !process.env.DATABASE_URL;

async function fetchRows(q) {
  if (useFallback) {
    const query = (q || '').toLowerCase();
    return fallbackAgences
      .filter((a) => a.actif)
      .filter((a) => !query || a.nom.toLowerCase().includes(query) || (a.quartier || '').toLowerCase().includes(query))
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }
  const params = [];
  let sql = 'SELECT * FROM agences WHERE actif = true';
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND (nom ILIKE $${params.length} OR quartier ILIKE $${params.length})`;
  }
  sql += ' ORDER BY nom ASC';
  const { rows } = await pool.query(sql, params);
  return rows;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Distance à vol d'oiseau (km) — formule de haversine
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Score de localisation : distance en km, avec un bonus (en km-équivalent)
// pour les agences principales — elles ont plus de guichets/services, donc
// à distance égale elles sont mises en avant. Score le plus bas = le mieux classé.
const TYPE_BONUS_KM = { principale: 0.4, standard: 0 };

function scoreAgence(agence, lat, lng) {
  const distanceKm = haversineKm(lat, lng, agence.latitude, agence.longitude);
  const bonus = TYPE_BONUS_KM[agence.type] || 0;
  return { distanceKm, score: Math.max(0, distanceKm - bonus) };
}

exports.list = async (req, res, next) => {
  try {
    const { lat, lng, q } = req.query;
    const rows = await fetchRows(q);

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const hasCoords = isFinite(userLat) && isFinite(userLng);

    let data = rows;
    if (hasCoords) {
      data = rows
        .map((agence) => {
          const { distanceKm, score } = scoreAgence(agence, userLat, userLng);
          return { ...agence, distance_km: Math.round(distanceKm * 100) / 100, score: Math.round(score * 100) / 100 };
        })
        .sort((a, b) => a.score - b.score);
    }

    res.json({ message: 'ok', data });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    if (useFallback) {
      const agence = fallbackAgences.find((a) => a.actif && String(a.id) === req.params.id);
      if (!agence) return res.status(404).json({ message: 'Agence introuvable' });
      return res.json({ message: 'ok', data: agence });
    }
    const { rows } = await pool.query('SELECT * FROM agences WHERE id = $1 AND actif = true', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Agence introuvable' });
    res.json({ message: 'ok', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const REQUIRED_FIELDS = ['nom', 'quartier', 'zone', 'adresse', 'latitude', 'longitude'];

function validate(body) {
  for (const f of REQUIRED_FIELDS) {
    if (body[f] === undefined || body[f] === '') return `Champ requis manquant: ${f}`;
  }
  if (!isFinite(parseFloat(body.latitude)) || !isFinite(parseFloat(body.longitude))) {
    return 'Coordonnées GPS invalides';
  }
  if (!ZONE_IDS.includes(body.zone)) {
    return 'Zone invalide';
  }
  return null;
}

// Un admin rattaché à une zone (chef de zone) ne gère que les agences de
// cette zone. Un admin sans zone (super-admin, ex. le compte de seed) gère
// tout. `admin.zone` vient du token JWT (voir authController.login).
function forbiddenZone(admin, zone) {
  return !!admin?.zone && admin.zone !== zone;
}

exports.create = async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    const { nom, type = 'standard', quartier, adresse, telephone = null, latitude, longitude, horaires = '', services = [] } = req.body;
    // Un chef de zone ne peut créer que dans sa propre zone.
    const zone = req.admin?.zone || req.body.zone;
    if (forbiddenZone(req.admin, zone)) {
      return res.status(403).json({ message: 'Vous ne pouvez créer une agence que dans votre zone' });
    }

    if (useFallback) {
      const nextId = fallbackAgences.reduce((max, a) => Math.max(max, a.id), 0) + 1;
      const agence = { id: nextId, nom, type, quartier, zone, adresse, telephone, latitude: parseFloat(latitude), longitude: parseFloat(longitude), horaires, services, actif: true, disponible: true };
      fallbackAgences.push(agence);
      return res.status(201).json({ message: 'ok', data: agence });
    }

    const { rows } = await pool.query(
      `INSERT INTO agences (nom, type, quartier, zone, adresse, telephone, latitude, longitude, horaires, services)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nom, type, quartier, zone, adresse, telephone, latitude, longitude, horaires, JSON.stringify(services)]
    );
    res.status(201).json({ message: 'ok', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    const { nom, type = 'standard', quartier, zone, adresse, telephone = null, latitude, longitude, horaires = '', services = [] } = req.body;

    if (useFallback) {
      const agence = fallbackAgences.find((a) => String(a.id) === req.params.id);
      if (!agence) return res.status(404).json({ message: 'Agence introuvable' });
      if (forbiddenZone(req.admin, agence.zone) || forbiddenZone(req.admin, zone)) {
        return res.status(403).json({ message: 'Vous ne pouvez modifier que les agences de votre zone' });
      }
      Object.assign(agence, { nom, type, quartier, zone, adresse, telephone, latitude: parseFloat(latitude), longitude: parseFloat(longitude), horaires, services });
      return res.json({ message: 'ok', data: agence });
    }

    const { rows: current } = await pool.query('SELECT zone FROM agences WHERE id = $1 AND actif = true', [req.params.id]);
    if (!current.length) return res.status(404).json({ message: 'Agence introuvable' });
    if (forbiddenZone(req.admin, current[0].zone) || forbiddenZone(req.admin, zone)) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que les agences de votre zone' });
    }

    const { rows } = await pool.query(
      `UPDATE agences SET nom=$1, type=$2, quartier=$3, zone=$4, adresse=$5, telephone=$6, latitude=$7, longitude=$8, horaires=$9, services=$10
       WHERE id=$11 AND actif=true RETURNING *`,
      [nom, type, quartier, zone, adresse, telephone, latitude, longitude, horaires, JSON.stringify(services), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Agence introuvable' });
    res.json({ message: 'ok', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.toggleDisponible = async (req, res, next) => {
  try {
    if (useFallback) {
      const agence = fallbackAgences.find((a) => String(a.id) === req.params.id);
      if (!agence) return res.status(404).json({ message: 'Agence introuvable' });
      if (forbiddenZone(req.admin, agence.zone)) {
        return res.status(403).json({ message: 'Vous ne pouvez modifier que les agences de votre zone' });
      }
      agence.disponible = req.body.disponible !== undefined ? !!req.body.disponible : !agence.disponible;
      return res.json({ message: 'ok', data: agence });
    }
    const { rows: current } = await pool.query('SELECT disponible, zone FROM agences WHERE id = $1 AND actif = true', [req.params.id]);
    if (!current.length) return res.status(404).json({ message: 'Agence introuvable' });
    if (forbiddenZone(req.admin, current[0].zone)) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que les agences de votre zone' });
    }
    const next = req.body.disponible !== undefined ? !!req.body.disponible : !current[0].disponible;
    const { rows } = await pool.query('UPDATE agences SET disponible = $1 WHERE id = $2 RETURNING *', [next, req.params.id]);
    res.json({ message: 'ok', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (useFallback) {
      const idx = fallbackAgences.findIndex((a) => String(a.id) === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Agence introuvable' });
      if (forbiddenZone(req.admin, fallbackAgences[idx].zone)) {
        return res.status(403).json({ message: 'Vous ne pouvez supprimer que les agences de votre zone' });
      }
      fallbackAgences[idx].actif = false;
      return res.json({ message: 'ok' });
    }
    const { rows: current } = await pool.query('SELECT zone FROM agences WHERE id = $1 AND actif = true', [req.params.id]);
    if (!current.length) return res.status(404).json({ message: 'Agence introuvable' });
    if (forbiddenZone(req.admin, current[0].zone)) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que les agences de votre zone' });
    }
    const { rowCount } = await pool.query('UPDATE agences SET actif = false WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Agence introuvable' });
    res.json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    if (useFallback) {
      return res.json({ message: 'ok', data: { total_agences: fallbackAgences.filter((a) => a.actif).length } });
    }
    const { rows } = await pool.query('SELECT COUNT(*)::int AS total_agences FROM agences WHERE actif = true');
    res.json({ message: 'ok', data: rows[0] });
  } catch (err) {
    next(err);
  }
};
