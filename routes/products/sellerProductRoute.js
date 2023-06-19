const express = require('express');
const sellerProductController = require('../../controllers/sellerProductController');
const stockRoute = require('../../routes/products/stockRoute');
const imagesRoute = require('../../routes/products/imagesRoute');
const specRoute = require('../../routes/products/specRoute');
const discountsRoute = require('../../routes/products/discountsRoute');

const router = express.Router();

router.post('/', sellerProductController.createProduct);
router.get('/:sellerId', sellerProductController.getAllProductBySeller);
router.get(
  '/search/:sellerId',
  sellerProductController.getSearchProductBySeller
);
router.get(
  '/searchmultichoice/:sellerId',
  sellerProductController.getSearchMultiChoiceProductBySeller
);
router.get('/sort/:sellerId', sellerProductController.getSortProductBySeller);
router.get('/byid/:productId', sellerProductController.getProductById);
router.get(
  '/category/:categoryId',
  sellerProductController.getProductByCategoryId
);
router.patch('/:productId', sellerProductController.updateProduct);
// router.delete('/:productId', sellerProductController.deleteProduct);

router.use('/stock', stockRoute);
router.use('/images', imagesRoute);
router.use('/spec', specRoute);
router.use('/discounts', discountsRoute);

module.exports = router;
