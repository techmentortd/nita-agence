// Zonage administratif interne de N'Djamena, par regroupement de quartiers
// (NITA ne publie pas de découpage officiel par zone) — sert à assigner
// chaque agence à une zone et chaque nouvel admin (chef d'agence) à cette
// même zone. Zones identifiées par numéro. À ajuster si un découpage
// officiel est communiqué.
const ZONES = [
  { id: '1', nom: 'Zone 1' },
  { id: '2', nom: 'Zone 2' },
  { id: '3', nom: 'Zone 3' },
  { id: '4', nom: 'Zone 4' },
  { id: '5', nom: 'Zone 5' },
];

const ZONE_IDS = ZONES.map((z) => z.id);

const QUARTIER_ZONE = {
  'Farcha': '1', 'Chari Mongo': '1', 'Djambal Bahr': '1', 'Karkandjié': '1', 'Sabangali': '1',
  'Centre-ville': '2', 'Moursal': '2', 'Ridina': '2', 'Paris-Congo': '2', 'Nouveau pont': '2', 'Klemat': '2',
  'Chagoua': '3', 'Dembé': '3', "N'Djari": '3', 'Gassi': '3', 'Habena': '3', 'Klessoum': '3',
  'Amsinéné': '4', 'Goudji': '4', 'Diguel': '4', 'Toukra': '4', 'Palmal': '4', 'Ngon-mba': '4',
  'Walia': '5', 'Amriguébé': '5', 'Ardep-Djoumal': '5', 'Hamama': '5', 'Aéroport': '5', "N'Guéli": '5',
};

function zoneForQuartier(quartier) {
  return QUARTIER_ZONE[quartier] || '2';
}

module.exports = { ZONES, ZONE_IDS, zoneForQuartier };
