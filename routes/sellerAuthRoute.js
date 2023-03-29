const express = require('express');
const sellerAuthController = require('../controllers/SellerAuthController');

const router = express.Router();

router.post('/register', sellerAuthController.register);
router.post('/login', sellerAuthController.login);

module.exports = router;
