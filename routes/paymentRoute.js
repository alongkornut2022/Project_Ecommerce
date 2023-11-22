const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.patch(
  '/transferMoney/:customerId/:paymentId/:orderDetailId',
  upload.fields([{ name: 'transfermoney', maxCount: 1 }]),
  PaymentController.updatePayment
);

module.exports = router;
