// Régénère seed.sql à partir de src/data/agencesSeed.js (source unique),
// pour éviter les erreurs d'échappement SQL manuel.
const fs = require('fs');
const path = require('path');
const agences = require('../src/data/agencesSeed');

function sqlStr(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}

const header = `-- Agences NITA réelles à N'Djamena, Tchad — extraites de la page officielle
-- "Notre Réseau" (tchad.nitatransfert.com/reseau) le 2026-09-21.
-- Généré depuis src/data/agencesSeed.js — ne pas éditer ce fichier à la main,
-- modifier la source puis relancer: node scripts/generate-seed-sql.js
TRUNCATE agences RESTART IDENTITY;

INSERT INTO agences (nom, type, quartier, zone, adresse, telephone, latitude, longitude, horaires, services) VALUES\n`;

const rows = agences.map((a) => {
  const services = sqlStr(JSON.stringify(a.services));
  return `(${sqlStr(a.nom)}, ${sqlStr(a.type)}, ${sqlStr(a.quartier)}, ${sqlStr(a.zone)}, ${sqlStr(a.adresse)}, ${sqlStr(a.telephone)}, ${a.latitude}, ${a.longitude}, ${sqlStr(a.horaires)}, ${services})`;
});

const sql = header + rows.join(',\n') + ';\n';
fs.writeFileSync(path.join(__dirname, '../seed.sql'), sql, 'utf8');
console.log(`seed.sql régénéré avec ${agences.length} agences.`);
