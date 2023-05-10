const express = require('express');

const ResultController = require('../controllers/ResultController');

const router = express.Router();

router.post('/:orderId/:customerId', ResultController.createOrderResult);
router.get('/:resultId/:customerId', ResultController.getOrderResult);
router.patch('/:resultId/:customerId', ResultController.updateOrderResult);
router.delete('/:resultId/:customerId', ResultController.deleteOrderResult);

module.exports = router;
