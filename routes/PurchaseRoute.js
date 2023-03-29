const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

router.post('/', PurchaseController.cart);

module.exports = router;
