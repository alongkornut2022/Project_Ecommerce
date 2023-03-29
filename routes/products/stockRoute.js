const express = require('express');
const stockController = require('../../controllers/stockController');
const sellerAuthenticate = require('../../middlewares/sellerAuthenticate');

const router = express.Router();

router.post('/stock', stockController.createProductStock);
router.get('/stock', stockController.getProductStock);
router.patch('/stock/:id', stockController.updateProductStock);
router.delete('/stock/:id', stockController.deleteProductStock);

module.exports = router;
