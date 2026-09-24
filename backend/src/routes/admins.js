const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const requireAuth = require('../middleware/auth');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

router.use(requireAuth);

// Self-service — tout admin authentifié gère son propre compte.
router.put('/me', controller.updateSelf);

// Gestion des chefs d'agence — réservé au super-admin.
router.get('/', requireSuperAdmin, controller.list);
router.post('/', requireSuperAdmin, controller.create);
router.put('/:id', requireSuperAdmin, controller.update);
router.delete('/:id', requireSuperAdmin, controller.remove);

module.exports = router;
