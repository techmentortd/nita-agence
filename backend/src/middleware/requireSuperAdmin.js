// Un admin sans zone (zone = null) est le super-admin — seul lui peut
// gérer les comptes des chefs d'agence (créer, lister, modifier, supprimer).
// Un chef d'agence ne gère que son propre compte via PUT /api/admins/me.
module.exports = function requireSuperAdmin(req, res, next) {
  if (req.admin?.zone) {
    return res.status(403).json({ message: 'Réservé au super-admin' });
  }
  next();
};
