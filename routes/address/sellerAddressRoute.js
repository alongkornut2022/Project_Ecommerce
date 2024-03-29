const express = require('express');
const sellerAddressController = require('../../controllers/sellerAddressController');

const router = express.Router();

router.post('/:sellerId', sellerAddressController.createAddress);
router.get('/:sellerId', sellerAddressController.getAllAddress);
router.get(
  '/:sellerId/:sellerAddressId',
  sellerAddressController.getAddressById
);
router.patch(
  '/:sellerAddressId/:sellerId',
  sellerAddressController.updateAddress
);
router.delete(
  '/:sellerAddressId/:sellerId',
  sellerAddressController.deleteAddress
);

module.exports = router;
