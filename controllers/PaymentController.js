const fs = require('fs');
const { Payment, OrderDetail } = require('../models');
const cloudinary = require('../utils/cloundinary');
const createError = require('../utils/createError');

exports.updatePayment = async (req, res, next) => {
  try {
    const { customerId, paymentId, orderDetailId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    if (!req.files) {
      createError('CustomerPicture is required', 400);
    }

    const payment = await Payment.findOne({ where: { id: paymentId } });
    console.log(payment);

    if (payment.dataValues.image != null) {
      const splited = payment.dataValues.image.split('/');
      const publicId = splited[splited.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }

    const result = await cloudinary.upload(req.files.transfermoney[0].path);
    const updateValue = result.secure_url;

    await Payment.update(
      { status: 'ชำระเงินแล้ว', image: updateValue },
      { where: { id: paymentId } }
    );

    await OrderDetail.update(
      { status: 'ชำระเงินแล้ว' },
      { where: { id: orderDetailId } }
    );

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.transfermoney) {
      fs.unlinkSync(req.files.transfermoney[0].path);
    }
  }
};
