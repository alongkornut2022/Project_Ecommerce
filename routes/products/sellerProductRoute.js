const express = require('express');
const sellerProductController = require('../../controllers/sellerProductController');
const stockRoute = require('../../routes/products/stockRoute');
const imagesRoute = require('../../routes/products/imagesRoute');
// const specRoute = require('../../routes/products/specRoute');
const discountsRoute = require('../../routes/products/discountsRoute');

const router = express.Router();

router.post('/:sellerId', sellerProductController.createProduct);

router.get('/:sellerId', sellerProductController.getAllProductBySeller);
router.get(
  '/search/:sellerId',
  sellerProductController.getSearchProductBySeller
);
router.get('/sort/:sellerId', sellerProductController.getSortProductBySeller);
router.get('/byid/:productId', sellerProductController.getProductById);
router.get(
  '/category/:categoryId',
  sellerProductController.getProductByCategoryId
);

router.patch('/:sellerId/:productId', sellerProductController.updateProduct);

router.use('/stock', stockRoute);
router.use('/images', imagesRoute);
router.use('/discounts', discountsRoute);

module.exports = router;

// router.use('/spec', specRoute);

// router.delete('/:productId', sellerProductController.deleteProduct);

// router.get(
//   '/search/:sellerId',
//   sellerProductController.getSearchProductBySeller
// );
