// routes/donationRoutes.js
const router = require('express').Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');

router.post('/create-order', auth, donationController.createOrder);
router.post('/update-transaction', auth, donationController.updateTransaction);
router.get('/history', auth, donationController.getDonationHistory);
router.get('/download', auth, donationController.downloadDonationHistory);
router.get('/search', donationController.searchCharities);

module.exports = router;
