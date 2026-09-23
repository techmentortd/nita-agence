// Doit rester synchronisé avec backend/src/data/zones.js
export const ZONES = [
  { id: 'nord', nom: 'Nord', color: '#2563eb' },
  { id: 'centre', nom: 'Centre', color: '#7c3aed' },
  { id: 'est', nom: 'Est', color: '#16a34a' },
  { id: 'sud', nom: 'Sud', color: '#f2701e' },
  { id: 'ouest', nom: 'Ouest', color: '#0891b2' },
];

export function zoneInfo(id) {
  return ZONES.find((z) => z.id === id) || null;
}

export function zoneLabel(id) {
  return zoneInfo(id)?.nom || id || '—';
}
