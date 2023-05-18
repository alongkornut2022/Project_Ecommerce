const express = require('express');
const orderRoute = require('../routes/orderRoute');
// const resultRoute = require('../routes/resultRoute');

const router = express.Router();

router.use('/order', orderRoute);
// router.use('/result', resultRoute);

module.exports = router;
