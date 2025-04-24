// routes/adminRoutes.js
const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protected admin routes
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);
router.put('/users/:id/make-admin', auth, adminAuth, adminController.makeAdmin);

// (Add additional admin routes for charity management if needed)
router.get('/charities', auth, adminAuth, adminController.getAllCharities);

module.exports = router;
