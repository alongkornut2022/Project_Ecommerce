const { Op } = require('sequelize');
const {
  CustomerAddress,
  ThaiProvinces,
  ThaiAmphures,
  ThaiTambons,
} = require('../models');
const createError = require('../utils/createError');
const { getThaiTambons } = require('./ThaiAddressController');

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
      subDistrict,
      district,
      province,
      postcode,
      phoneNumber,
    } = req.body;

    const nameProvince = await ThaiProvinces.findOne({
      where: { id: province },
    });

    const nameDistrict = await ThaiAmphures.findOne({
      where: { id: district },
    });

    const nameSubDistrict = await ThaiTambons.findOne({
      where: { id: subDistrict },
    });

    // nameProvince = nameProvince === null ? province : nameProvince.nameTh;
    // nameDistrict = nameDistrict === null ? district : nameDistrict.nameTh;

    const oldAddressDefault = await CustomerAddress.findOne({
      where: {
        [Op.and]: [{ customerId: customerId }, { status: 'default' }],
      },
    });

    if (!oldAddressDefault) {
      const customerAdderss = await CustomerAddress.create({
        firstName,
        lastName,
        addressDetail,
        subDistrict: nameSubDistrict.nameTh,
        district: nameDistrict.nameTh,
        province: nameProvince.nameTh,
        postcode,
        phoneNumber,
        customerId: req.customer.id,
        status: 'default',
      });
      res.status(201).json({ customerAdderss: customerAdderss });
    } else {
      const customerAdderss = await CustomerAddress.create({
        firstName,
        lastName,
        addressDetail,
        subDistrict: nameSubDistrict.nameTh,
        district: nameDistrict.nameTh,
        province: nameProvince.nameTh,
        postcode,
        phoneNumber,
        customerId: req.customer.id,
        status: 'none',
      });
      res.status(201).json({ customerAdderss: customerAdderss });
    }
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

    const customerAddressAll = await CustomerAddress.findAll({
      where: { customerId: req.customer.id },
    });
    res.json({ customerAddressAll: customerAddressAll });
  } catch (err) {
    next(err);
  }
};

exports.getDefaultAddress = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const customerAddressDefault = await CustomerAddress.findOne({
      where: {
        [Op.and]: [{ customerId: customerId }, { status: 'default' }],
      },
    });

    res.json({ customerAddressDefault: customerAddressDefault });
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
      subDistrict,
      district,
      province,
      postcode,
      phoneNumber,
    } = req.body;

    let nameProvince = await ThaiProvinces.findOne({
      where: { id: province },
    });

    let nameDistrict = await ThaiAmphures.findOne({
      where: { id: district },
    });

    let nameSubDistrict = await ThaiTambons.findOne({
      where: { id: subDistrict },
    });

    nameProvince = nameProvince === null ? province : nameProvince.nameTh;
    nameDistrict = nameDistrict === null ? district : nameDistrict.nameTh;
    nameSubDistrict =
      nameSubDistrict === null ? subDistrict : nameSubDistrict.nameTh;

    await CustomerAddress.update(
      {
        firstName,
        lastName,
        addressDetail,
        subDistrict: nameSubDistrict,
        district: nameDistrict,
        province: nameProvince,
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

exports.updateStatus = async (req, res, next) => {
  try {
    const { customerAddressId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const oldAddressDefault = await CustomerAddress.findOne({
      where: {
        [Op.and]: [{ customerId: customerId }, { status: 'default' }],
      },
    });

    if (!oldAddressDefault) {
      createError('invaild address', 400);
    }

    await CustomerAddress.update(
      { status: 'none' },
      { where: { id: oldAddressDefault.id, customerId: req.customer.id } }
    );

    await CustomerAddress.update(
      {
        status: 'default',
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
