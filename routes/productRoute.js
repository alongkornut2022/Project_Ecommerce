const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/category/:categoryId', productController.getProductByCategory);
router.get('/bestbuy', productController.getProductBestBuy);
router.get('/newproduct', productController.getNewProduct);
router.get('/:productId', productController.getProductById);

module.exports = router;
