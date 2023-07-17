const express = require('express');
const specController = require('../../controllers/products/specController');
const uploadText = require('../../middlewares/uploadText');

const router = express.Router();

router.post(
  '/:sellerId',
  uploadText.single('productSpec'),
  specController.createProductSpec
);

router.patch(
  '/:sellerId/:productId',
  uploadText.single('productSpec'),
  specController.updateProductSpec
);

module.exports = router;
