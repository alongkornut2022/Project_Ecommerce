const express = require('express');

const OrderController = require('../controllers/OrderController');

const router = express.Router();

router.post('/:cartId/:customerId', OrderController.createOrderItem);
router.get('/:orderId/:customerId', OrderController.getOrderItem);
router.patch('/:orderId/:customerId', OrderController.updateOrderItem);
router.delete('/:orderId/:customerId', OrderController.deleteOrderItem);

module.exports = router;
