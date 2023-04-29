const express = require('express');
const productSearchController = require('../controllers/productSearchController');

const router = express.Router();

router.get('/sort', productSearchController.getProductSearch);

module.exports = router;
