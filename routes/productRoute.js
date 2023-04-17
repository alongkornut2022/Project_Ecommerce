const express = require('express');
const productController = require('../controllers/productController');
const productCategoryRoute = require('../routes/productCategoryRoute');

const router = express.Router();

router.use('/category', productCategoryRoute);

router.get('/bestbuy', productController.getProductBestBuy);
router.get('/newproduct', productController.getNewProduct);
router.get('/search', productController.getProductSearch);
router.get('/:productId', productController.getProductById);
router.get('/shop/:sellerId', productController.getAllProductBySeller);

module.exports = router;
