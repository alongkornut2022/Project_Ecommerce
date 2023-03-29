const express = require('express');
const customerAddressRoute = require('../routes/address/customerAddressRoute');
const sellerAddressRoute = require('../routes/address/sellerAddressRoute');

const customerAuthenticate = require('../middlewares/customerAuthenticate');
const sellerAuthenticate = require('../middlewares/sellerAuthenticate');

const router = express.Router();

router.use('/customer', customerAuthenticate, customerAddressRoute);
router.use('/seller', sellerAuthenticate, sellerAddressRoute);

module.exports = router;
