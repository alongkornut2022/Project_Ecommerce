const express = require('express');
const productController = require('../controllers/productController');
const productCategoryRoute = require('../routes/productCategoryRoute');
const productSearchRoute = require('../routes/productSearchRoute');

const router = express.Router();

router.use('/category', productCategoryRoute);
router.use('/search', productSearchRoute);

router.get('/sort', productController.getProductSort);

router.get('/:productId', productController.getProductById);
router.get('/shop/:sellerId', productController.getAllProductBySeller);

module.exports = router;
