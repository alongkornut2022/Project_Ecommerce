const express = require('express');
const customerAddressController = require('../../controllers/customerAddressController');

const router = express.Router();

router.post('/:customerId', customerAddressController.createAddress);
router.get('/:customerId', customerAddressController.getAllAddress);
router.get(
  '/:customerId/:customerAddressId',
  customerAddressController.getAddressById
);
router.patch(
  '/:customerAddressId/:customerId',
  customerAddressController.updateAddress
);
router.delete(
  '/:customerAddressId/:customerId',
  customerAddressController.deleteAddress
);

module.exports = router;
