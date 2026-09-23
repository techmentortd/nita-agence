// Agences NITA réelles à N'Djamena, Tchad — extraites de la page officielle
// "Notre Réseau" (tchad.nitatransfert.com/reseau) le 2026-09-21.
// Les coordonnées GPS sont des estimations au niveau du quartier (le site
// officiel ne publie pas de coordonnées précises par agence) — à corriger
// dès qu'un relevé GPS exact est disponible pour chaque point de service.
// Le téléphone est la ligne centrale NITA (+235 97 78 78 78) : les agences
// de N'Djamena n'ont pas de numéro individuel publié.
//
// Source unique — seed.sql est généré à partir de ce fichier
// (voir backend/scripts/generate-seed-sql.js).
const { zoneForQuartier } = require('./zones');

const SERVICES = ['Dépôt', 'Retrait', 'Transfert national', 'Transfert international', 'Recharge MyNITA'];
const HORAIRES = '7h-23h, tous les jours';
const TEL = '+235 97 78 78 78';

const RAW = [
  ['Agence Amsinéné', 'standard', 'Amsinéné', 'Non loin de CSP 11', 12.0600, 15.0250],
  ['Agence Farcha', 'standard', 'Farcha', 'À 200 m de OLA Farcha', 12.1620, 15.0330],
  ['Agence Goudji', 'standard', 'Goudji', 'Sur la route du rond-point Sécébane, à côté de la boulangerie', 12.0680, 15.0150],
  ['Marché Diguel', 'standard', 'Diguel', 'Au marché de Diguel', 12.0790, 15.0180],
  ['Ola Diguel', 'standard', 'Diguel', 'Au sein de la station OLA', 12.0810, 15.0200],
  ['Ola Farcha', 'standard', 'Farcha', 'Au sein de la station OLA', 12.1600, 15.0350],
  ['Rue de 30', 'standard', 'Aéroport', 'À environ 400 m de la station Star, vers la rue de 50', 12.1260, 15.0430],
  ["Rue de 40", 'standard', 'Aéroport', "Vers le rond-point Adoum Tchéré, en allant vers l'aéroport", 12.1230, 15.0470],
  ['Tacha Mao', 'standard', 'Goudji', 'Gare routière Tacha Mao', 12.0650, 15.0180],
  ['Tacha Moussoro', 'standard', 'Goudji', "Vers l'échangeur de Goudji, en allant vers Tacha Moussoro", 12.0670, 15.0230],
  ['Chagoua USA', 'standard', 'Chagoua', "Près de l'échangeur de Chagoua, après l'ambassade des USA, en allant vers Dembé", 12.0870, 15.0730],
  ['Double voie', 'standard', 'Chagoua', "À Chagoua, après l'espace Hanakou, presque en face de l'hôtel Zenabel", 12.0900, 15.0700],
  ['HEC Tchad', 'standard', "N'Djari", "Au sein de l'Université HEC Tchad, à N'Djari", 12.1250, 15.1210],
  ['Ola Chagoua', 'standard', 'Chagoua', 'Au rond-point Chagoua, au sein de la station OLA', 12.0850, 15.0710],
  ['Ola Chari Mongo', 'standard', 'Chari Mongo', 'Au sein de la station OLA Chari Mongo', 12.1550, 15.0600],
  ['Ola Dembé', 'standard', 'Dembé', "À côté de l'échangeur, en allant vers Chagoua", 12.0950, 15.0850],
  ['Ola Hamama', 'standard', 'Hamama', 'Rond-point Hamama', 12.1200, 15.0480],
  ['SNR (Rue de 60)', 'standard', 'Klemat', 'À côté du rond-point SNR, collé à la mosquée', 12.1290, 15.0640],
  ['Walia Sopetrans', 'standard', 'Walia', "Rond-point vers l'ancien pont, en allant vers Abéna", 12.1080, 15.0230],
  ['Gassi 1', 'standard', 'Gassi', "À côté d'Électron TV, sur la grande voie", 12.0780, 15.0950],
  ['Gassi 2', 'standard', 'Gassi', 'Non loin du marché Atrone, au virage avant AVD', 12.0750, 15.0980],
  ['Habena', 'standard', 'Habena', "En allant vers Hydrocarbures, à l'étage sur le goudron", 12.0700, 15.0650],
  ['Kléssoum', 'standard', 'Klessoum', "À l'entrée de Kléssoum, sur le goudron", 12.0950, 15.1050],
  ['Ngon-mba', 'standard', 'Ngon-mba', 'À côté du marché de Ngon-mba', 12.0680, 15.0450],
  ['Ola Toukra', 'standard', 'Toukra', 'Au sein de la station OLA, sur la grande voie', 12.0350, 15.0350],
  ['Palmal', 'standard', 'Palmal', 'Non loin du marché Palmal, à Atrone', 12.0550, 15.0400],
  ['Walia Hadjaraï', 'standard', 'Walia', 'Quartier Hadjaraï', 12.1020, 15.0180],
  ['Walia Station Guéra', 'standard', "N'Guéli", "À N'Guéli, au sein de la station Guéra", 12.1150, 14.9950],
  ['Walia 1 (3AS)', 'standard', 'Walia', "Sur la voie en face de 3AS, devant l'hôpital Bon Samaritain", 12.1060, 15.0250],
  ['Amriguébé', 'standard', 'Amriguébé', 'En face du restaurant Cap Town', 12.1200, 15.0350],
  ['Ardebdjoumal', 'standard', 'Ardep-Djoumal', 'Sur le goudron, non loin du marché Ndombolo', 12.0980, 15.0300],
  ['Grand marché', 'standard', 'Centre-ville', 'Non loin du commissariat CSP3, en face de la grande mosquée, Charidab', 12.1132, 15.0491],
  ['Moursal N°2', 'standard', 'Moursal', "À côté de l'école Chign", 12.1190, 15.0760],
  ['Moursal Siège', 'principale', 'Moursal', 'Au sein du siège, à Moursal, en face de la CECOCDA', 12.1170, 15.0770],
  ['Nouveau pont', 'standard', 'Nouveau pont', "À la descente du nouveau pont, non loin de l'église catholique", 12.1300, 15.0700],
  ['Ola Djambalbhar', 'standard', 'Djambal Bahr', 'Au sein de la station OLA', 12.1550, 15.0480],
  ['Ola Karkandjié', 'standard', 'Karkandjié', 'Vers la maison de la Femme, devant la station OLA', 12.1400, 15.0600],
  ['Ola Sabangali', 'standard', 'Sabangali', 'Au sein de la station OLA, en face du goudron', 12.1490, 15.0430],
  ['Ridina', 'standard', 'Ridina', 'Avenue Charles de Gaulle, non loin des vendeurs de moto', 12.1080, 15.0510],
  ['Tradex Pari-Congo', 'standard', 'Paris-Congo', 'En face du stade, au sein de la station Tradex', 12.1000, 15.0600],
];

module.exports = RAW.map(([nom, type, quartier, adresse, latitude, longitude], i) => ({
  id: i + 1,
  nom,
  type,
  quartier,
  zone: zoneForQuartier(quartier),
  adresse,
  telephone: TEL,
  latitude,
  longitude,
  horaires: HORAIRES,
  services: SERVICES,
  actif: true,
  disponible: true,
}));
