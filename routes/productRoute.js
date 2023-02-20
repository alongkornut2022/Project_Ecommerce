const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/productitem', productController.productItem);

module.exports = router;
