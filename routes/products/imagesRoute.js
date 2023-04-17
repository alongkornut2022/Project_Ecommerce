const express = require('express');
const imagesController = require('../../controllers/products/imagesController');

const upload = require('../../middlewares/upload');

const router = express.Router();

router.post(
  '/:productId',
  upload.array('productImages', { maxCount: 9 }),
  imagesController.createProductImages
);

router.patch(
  '/:productId',
  upload.array('productImages', { maxCount: 9 }),
  imagesController.updateProductImages
);

router.delete('/:productId', imagesController.deleteAllProductImagesById);
// router.delete(
//   '/images/:productId',
//   imagesController.deleteOneProductImagesById
// );

module.exports = router;
