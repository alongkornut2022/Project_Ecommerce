const express = require('express');
const discountsController = require('../../controllers/products/discountsController');

const router = express.Router();

router.post('/:productId', discountsController.createDiscounts);
router.patch('/:productId', discountsController.updateDiscounts);
router.delete('/:productId', discountsController.deleteDiscounts);

module.exports = router;
