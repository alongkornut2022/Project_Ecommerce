const express = require('express');
const stockController = require('../../controllers/products/stockController');

const router = express.Router();

router.patch('/:sellerId/:productId', stockController.updateAlreadysold);

module.exports = router;
