// Zonage administratif interne de N'Djamena, par regroupement de quartiers
// (NITA ne publie pas de découpage officiel par zone) — sert à assigner
// chaque agence à une zone et chaque nouvel admin (chef de zone) à cette
// même zone. À ajuster si un découpage officiel est communiqué.
const ZONES = [
  { id: 'nord', nom: 'Nord' },
  { id: 'centre', nom: 'Centre' },
  { id: 'est', nom: 'Est' },
  { id: 'sud', nom: 'Sud' },
  { id: 'ouest', nom: 'Ouest' },
];

const ZONE_IDS = ZONES.map((z) => z.id);

const QUARTIER_ZONE = {
  'Farcha': 'nord', 'Chari Mongo': 'nord', 'Djambal Bahr': 'nord', 'Karkandjié': 'nord', 'Sabangali': 'nord',
  'Centre-ville': 'centre', 'Moursal': 'centre', 'Ridina': 'centre', 'Paris-Congo': 'centre', 'Nouveau pont': 'centre', 'Klemat': 'centre',
  'Chagoua': 'est', 'Dembé': 'est', "N'Djari": 'est', 'Gassi': 'est', 'Habena': 'est', 'Klessoum': 'est',
  'Amsinéné': 'sud', 'Goudji': 'sud', 'Diguel': 'sud', 'Toukra': 'sud', 'Palmal': 'sud', 'Ngon-mba': 'sud',
  'Walia': 'ouest', 'Amriguébé': 'ouest', 'Ardep-Djoumal': 'ouest', 'Hamama': 'ouest', 'Aéroport': 'ouest', "N'Guéli": 'ouest',
};

function zoneForQuartier(quartier) {
  return QUARTIER_ZONE[quartier] || 'centre';
}

module.exports = { ZONES, ZONE_IDS, zoneForQuartier };
