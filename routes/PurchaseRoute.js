const express = require('express');
const orderRoute = require('../routes/orderRoute');

const router = express.Router();

router.use('/order', orderRoute);

module.exports = router;
