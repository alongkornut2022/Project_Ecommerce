const { Op } = require('sequelize');
const { SellerAddress } = require('../models');
const createError = require('../utils/createError');

exports.createAddress = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
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

    const oldAddressDefault = await SellerAddress.findOne({
      where: {
        [Op.and]: [{ sellerId: sellerId }, { status: 'default' }],
      },
    });

    if (!oldAddressDefault) {
      const sellerAdderss = await SellerAddress.create({
        firstName,
        lastName,
        addressDetail,
        district,
        province,
        postcode,
        phoneNumber,
        sellerId: req.seller.id,
        status: 'default',
      });
      res.status(201).json({ sellerAdderss: sellerAdderss });
    } else {
      const sellerAdderss = await SellerAddress.create({
        firstName,
        lastName,
        addressDetail,
        district,
        province,
        postcode,
        phoneNumber,
        sellerId: req.seller.id,
        status: 'none',
      });
      res.status(201).json({ sellerAdderss: sellerAdderss });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllAddress = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const sellerAdderssAll = await SellerAddress.findAll({
      where: { sellerId: req.seller.id },
    });
    res.json({ sellerAddressAll: sellerAdderssAll });
  } catch (err) {
    next(err);
  }
};

exports.getDefaultAddress = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild sellerr', 400);
    }

    const sellerAdderssDefault = await SellerAddress.findOne({
      where: {
        [Op.and]: [{ sellerId: sellerId }, { status: 'default' }],
      },
    });

    res.json({ sellerAddressDefault: sellerAdderssDefault });
  } catch (err) {
    next(err);
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const { sellerId, sellerAddressId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const sellerAdderss = await SellerAddress.findOne({
      where: { id: sellerAddressId, sellerId: req.seller.id },
    });
    res.json({ sellerAddress: sellerAdderss });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { sellerAddressId, sellerId } = req.params;

    if (req.seller.id != sellerId) {
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

    await SellerAddress.update(
      {
        firstName,
        lastName,
        addressDetail,
        district,
        province,
        postcode,
        phoneNumber,
      },
      { where: { id: sellerAddressId, sellerId: req.seller.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { sellerAddressId, sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild seller', 400);
    }

    const oldAddressDefault = await SellerAddress.findOne({
      where: {
        [Op.and]: [{ sellerId: sellerId }, { status: 'default' }],
      },
    });

    if (!oldAddressDefault) {
      createError('invaild address', 400);
    }

    await SellerAddress.update(
      { status: 'none' },
      { where: { id: oldAddressDefault.id, sellerId: req.seller.id } }
    );

    await SellerAddress.update(
      {
        status: 'default',
      },
      { where: { id: sellerAddressId, sellerId: req.seller.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { sellerAddressId, sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const result = await SellerAddress.destroy({
      where: { id: sellerAddressId, sellerId: req.seller.id },
    });

    if (result === 0) {
      createError('seller with this id not found', 400);
    }
    res.status(204).json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};
