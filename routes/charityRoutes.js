// routes/charityRoutes.js
const router = require('express').Router();
const charityController = require('../controllers/charityController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/register', auth, charityController.registerCharity);
router.get('/', charityController.getAllCharities);
router.get('/:id', charityController.getCharity);
router.put('/:id', auth, charityController.updateCharity);
router.put('/:id/approve', auth, adminAuth, charityController.approveCharity);
router.put('/:id/impact', auth, charityController.updateImpactReport);
router.get('/:id/impact', charityController.getImpactReport);
router.delete('/:id', auth, adminAuth, charityController.deleteCharity);

module.exports = router;
