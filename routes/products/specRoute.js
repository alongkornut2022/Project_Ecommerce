const express = require('express');
const specController = require('../../controllers/products/specController');
const uploadText = require('../../middlewares/uploadText');

const router = express.Router();

router.post(
  '/:productId',
  uploadText.single('productSpec'),
  specController.createProductSpec
);

router.patch(
  '/:productId',
  uploadText.single('productSpec'),
  specController.updateProductSpec
);

module.exports = router;
