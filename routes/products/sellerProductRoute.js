const express = require('express');
const SellerProductController = require('../../controllers/sellerProductController');

const router = express.Router();

router.post('/:sellerId', SellerProductController.createProductSeller);
router.get('/:sellerId', SellerProductController.getAllProductSeller);
router.get(
  '/:sellerId/productId',
  SellerProductController.getProductByIdSeller
);
router.get(
  '/:sellerId/:categoryId',
  SellerProductController.getProductByCategorySeller
);
router.patch(
  '/:sellerId/:productId',
  SellerProductController.updateProductSeller
);
router.delete(
  '/:sellerId/:productId',
  SellerProductController.deleteProductSeller
);

module.exports = router;
