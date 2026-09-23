// Doit rester synchronisé avec backend/src/data/zones.js
export const ZONES = [
  { id: '1', nom: 'Zone 1', color: '#2563eb' },
  { id: '2', nom: 'Zone 2', color: '#7c3aed' },
  { id: '3', nom: 'Zone 3', color: '#16a34a' },
  { id: '4', nom: 'Zone 4', color: '#f2701e' },
  { id: '5', nom: 'Zone 5', color: '#0891b2' },
];

export function zoneInfo(id) {
  return ZONES.find((z) => z.id === id) || null;
}

export function zoneLabel(id) {
  return zoneInfo(id)?.nom || id || '—';
}
