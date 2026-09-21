const express = require('express');
const router = express.Router();
const controller = require('../controllers/agenceController');
const requireAuth = require('../middleware/auth');

router.get('/stats', controller.stats);
router.get('/:id', controller.getById);
router.get('/', controller.list);

router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.patch('/:id/disponible', requireAuth, controller.toggleDisponible);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
