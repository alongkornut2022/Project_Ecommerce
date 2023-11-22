const express = require('express');

const OrderController = require('../controllers/OrderController');

const router = express.Router();

router.post('/:cartIds/:sellerIds/:customerId', OrderController.createOrder);
router.get('/:customerId', OrderController.getOrderDetail);
router.get(
  '/detailById/:customerId/:orderDetailId',
  OrderController.getOrderDetailById
);
router.get(
  '/productitem/:orderDetailId/customer/:customerId',
  OrderController.getOrderItem
);
router.get('/search/:customerId', OrderController.getSearchOrder);

router.patch('/:orderDetailId/:customerId', OrderController.updateOrderDetail);
// router.delete(
//   '/:orderDetailId/customer/:customerId',
//   OrderController.deleteOrderById
// );

module.exports = router;
