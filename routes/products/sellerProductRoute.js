const express = require('express');
const sellerProductController = require('../../controllers/sellerProductController');
const stockRoute = require('../../routes/products/stockRoute');
const imagesRoute = require('../../routes/products/imagesRoute');
const specRoute = require('../../routes/products/specRoute');

const router = express.Router();

router.post('/', sellerProductController.createProduct);
router.get('/', sellerProductController.getAllProductBySeller);
router.get('/:productId', sellerProductController.getProductById);
router.get(
  '/category/:categoryId',
  sellerProductController.getProductByCategoryId
);
router.patch('/:productId', sellerProductController.updateProduct);
// router.delete('/:productId', sellerProductController.deleteProduct);

router.use('/stock', stockRoute);
router.use('/images', imagesRoute);
router.use('/spec', specRoute);

module.exports = router;
