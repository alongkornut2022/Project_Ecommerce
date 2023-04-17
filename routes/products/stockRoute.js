const express = require('express');
const stockController = require('../../controllers/products/stockController');

const router = express.Router();

router.post('/:productId', stockController.createProductStock);
router.patch('/:productId', stockController.updateProductStock);
// router.delete('/:productId', stockController.deleteProductStock);

module.exports = router;
