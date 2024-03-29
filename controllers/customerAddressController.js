const { CustomerAddress } = require('../models');
const createError = require('../utils/createError');

exports.createAddress = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const {
      firstName,
      lastName,
      addressDetail,
      district,
      province,
      postcode,
      phoneNumber,
    } = req.body;

    const customerAdderss = await CustomerAddress.create({
      firstName,
      lastName,
      addressDetail,
      district,
      province,
      postcode,
      phoneNumber,
      customerId: req.customer.id,
    });

    res.status(201).json({ customerAdderss: customerAdderss });
  } catch (err) {
    next(err);
  }
};

exports.getAllAddress = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const customerAddress = await CustomerAddress.findAll({
      where: { customerId: req.customer.id },
    });
    res.json({ customerAddress: customerAddress });
  } catch (err) {
    next(err);
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const { customerId, customerAddressId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const customerAdderss = await CustomerAddress.findOne({
      where: { id: customerAddressId, customerId: req.customer.id },
    });
    res.json({ customerAddress: customerAdderss });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { customerAddressId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const {
      firstName,
      lastName,
      addressDetail,
      district,
      province,
      postcode,
      phoneNumber,
    } = req.body;

    await CustomerAddress.update(
      {
        firstName,
        lastName,
        addressDetail,
        district,
        province,
        postcode,
        phoneNumber,
      },
      { where: { id: customerAddressId, customerId: req.customer.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { customerAddressId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const result = await CustomerAddress.destroy({
      where: { id: customerAddressId, customerId: req.customer.id },
    });

    if (result === 0) {
      createError('customer with this id not found', 400);
    }
    res.status(204).json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};
