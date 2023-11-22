const express = require('express');

const DeliveryController = require('../controllers/DeliveryController');

const router = express.Router();

router.post(
  '/create/:sellerId/:customerId/:cartIdsBySellers',
  DeliveryController.createDelivery
);

router.patch(
  '/update/:cartIdsBySeller/:customerId',
  DeliveryController.updateDelivery
);

router.get('/price/:cartIds/:customerId', DeliveryController.getDeliveryPrice);

router.get(
  '/postcode/:postcode/:customerId',
  DeliveryController.getPostcodeZone
);

router.get(
  '/cartIds/:cartIdsBySeller/:customerId',
  DeliveryController.getDeliveryCartIds
);

router.get('/shipping/:customerId/', DeliveryController.getShippingRate);

router.patch(
  '/recived/:customerId/:deliveryId/:orderDetailId',
  DeliveryController.updateDeliveryRecived
);

module.exports = router;
