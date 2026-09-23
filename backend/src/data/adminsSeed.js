// Comptes admin de secours (sans DATABASE_URL) — identifiants de
// développement uniquement. Utilisateur par défaut : admin / nita2026
// À changer avant toute mise en production (voir npm run seed:admin).
// zone: null = super-admin (accès à toutes les zones) ; les admins créés
// depuis le panneau sont toujours rattachés à une zone (chef de zone).
module.exports = [
  {
    id: 1,
    username: 'admin',
    password_hash: '$2a$10$RgENmOu2Tm8H3uru22kh1OnpI7j.5FV6WeFBnCs.TZADs97fdhr5i',
    zone: null,
    created_at: new Date().toISOString(),
  },
];
