const bcrypt = require('bcryptjs');
const fs = require('fs');
const createError = require('../utils/createError');
const { Seller } = require('../models');
const cloudinary = require('../utils/cloundinary');
const { default: isStrongPassword } = require('validator/lib/isStrongPassword');

exports.getSellerMe = async (req, res) => {
  const seller = JSON.parse(JSON.stringify(req.seller));
  res.json({ seller });
};

exports.updateSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shopName, email, phoneNumber } = req.body;

    if (req.seller.id != id) {
      createError('invaild seller', 400);
    }

    await Seller.update(
      { shopName, email, phoneNumber },
      { where: { id: req.seller.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.updateSellerPic = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.seller.id != id) {
      createError('invaild customer', 400);
    }

    if (!req.files) {
      createError('sellerPicture is required', 400);
    }

    const updateValue = {};
    const result = await cloudinary.upload(req.files.shopPicture[0].path);
    if (req.seller.shopPicture) {
      const splited = req.seller.shopPicture.split('/');
      const publicId = splited[splited.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }
    updateValue.shopPicture = result.secure_url;

    await Seller.update(updateValue, { where: { id: req.seller.id } });
    res.json(updateValue);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.shopPicture) {
      fs.unlinkSync(req.files.shopPicture[0].path);
    }
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.seller.id != id) {
      createError('invaild customer', 400);
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const seller = await seller.findOne({
      where: {
        id: req.seller.id,
      },
    });

    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      customer.password
    );

    if (!isCorrectPassword) {
      createError('invaild password', 400);
    }

    if (newPassword.length < 8) {
      createError('password must be at least 8 character', 400);
    }

    if (newPassword !== confirmNewPassword) {
      createError('passwords do not match', 400);
    }

    if (!isStrongPassword(newPassword)) {
      createError('password not strong', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Seller.update(
      { password: hashedPassword },
      { where: { id: req.seller.id } }
    );
    res.json({ message: 'change password success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteSeller = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.seller.id != id) {
      createError('invaild seller', 400);
    }

    const result = await Seller.destroy({
      where: { id: id },
    });

    if (result === 0) {
      createError('seller with this id not found', 400);
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
