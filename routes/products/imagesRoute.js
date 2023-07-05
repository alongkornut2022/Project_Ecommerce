const express = require('express');
const imagesController = require('../../controllers/products/imagesController');
const uploadImageProduct = require('../../middlewares/uploadImageProduct');

const router = express.Router();

router.post(
  '/:sellerId',
  uploadImageProduct.array('productImages', { maxCount: 9 }),
  imagesController.createProductImages
);

router.patch(
  '/:sellerId/:productId',
  uploadImageProduct.array('productImages', { maxCount: 9 }),
  imagesController.updateProductImages
);

router.delete(
  '/delbyid/:sellerId/:productImagesId',
  imagesController.deleteProductImagesById
);

// router.delete(
//   '/:sellerId/:productId',
//   imagesController.deleteAllProductImagesById
// );

module.exports = router;
