// Grille tarifaire officielle NITA — zone "National", extraite de
// tchad.nitatransfert.com/outils le 2026-09-21.
// Palier 1 : frais fixes de 150 FCFA. Paliers suivants : pourcentage du
// montant total (non progressif — un seul taux s'applique sur tout le
// montant selon le palier atteint). Aucun frais au retrait pour le
// bénéficiaire.
export const TIERS = [
  { min: 1, max: 5000, fraisFixe: 150, taux: 0 },
  { min: 5001, max: 150000, taux: 0.03 },
  { min: 150001, max: 300000, taux: 0.028 },
  { min: 300001, max: 400000, taux: 0.026 },
  { min: 400001, max: 500000, taux: 0.024 },
  { min: 500001, max: 700000, taux: 0.022 },
  { min: 700001, max: 900000, taux: 0.02 },
  { min: 900001, max: 999999, taux: 0.012 },
  { min: 1000000, max: 25000000, taux: 0.01 },
];

// Pays où NITA est présent (réseau régional) — le site tchad.nitatransfert.com
// ne publie une grille tarifaire que pour la zone "National" (Tchad) ; les
// frais internationaux sont communiqués en agence, donc pas de calcul
// automatique ici pour éviter d'afficher un chiffre inventé.
export const PAYS_INTERNATIONAL = [
  'Bénin', 'Burkina Faso', "Côte d'Ivoire", 'Ghana', 'Guinée-Bissau', 'Guinée',
  'Mali', 'Mauritanie', 'Niger', 'Nigeria', 'Sénégal', 'Togo',
];

export function calculerFrais(montant) {
  const m = Number(montant);
  if (!m || m <= 0) return null;
  const tier = TIERS.find((t) => m >= t.min && m <= t.max);
  if (!tier) {
    return { montant: m, frais: null, total: null, tier: null, horsGrille: true };
  }
  const frais = tier.fraisFixe != null ? tier.fraisFixe : Math.round(m * tier.taux);
  return {
    montant: m,
    frais,
    total: m + frais,
    tier,
    horsGrille: false,
  };
}

export function fmtFcfa(n) {
  if (n == null || isNaN(n)) return '—';
  return Math.round(n).toLocaleString('fr-FR') + ' FCFA';
}

export function fmtTaux(tier) {
  if (!tier) return '';
  return tier.fraisFixe != null ? `${tier.fraisFixe.toLocaleString('fr-FR')} FCFA fixe` : `${(tier.taux * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
}
