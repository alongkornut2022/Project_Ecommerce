const express = require('express');
const sellerOrderController = require('../controllers/SellerOrderController');

const router = express.Router();

router.get('/:sellerId', sellerOrderController.getOrderDetail);
router.get(
  '/orderitem/:orderDetailId/seller/:sellerId',
  sellerOrderController.getOrderItem
);
router.get('/search/:sellerId', sellerOrderController.getSearchOrder);

router.patch(
  '/delivery/:sellerId/:deliveryId/:orderDetailId',
  sellerOrderController.updateDelivery
);

module.exports = router;
