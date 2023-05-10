const express = require('express');

const DeliveryController = require('../controllers/DeliveryController');

const router = express.Router();

router.get(
  '/postcode/:postcode/:customerId',
  DeliveryController.getPostcodeZone
);

router.get('/shipping/:customerId/', DeliveryController.getShippingRate);

module.exports = router;
