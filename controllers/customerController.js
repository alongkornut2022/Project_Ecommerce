const bcrypt = require('bcryptjs');
const fs = require('fs');
const createError = require('../utils/createError');
const { Customer } = require('../models');
const cloudinary = require('../utils/cloundinary');
const { default: isStrongPassword } = require('validator/lib/isStrongPassword');

exports.getCustomerMe = async (req, res) => {
  const customer = JSON.parse(JSON.stringify(req.customer));
  res.json({ customer });
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, gender, birthDate } = req.body;

    if (req.customer.id != id) {
      createError('invaild customer', 400);
    }

    await Customer.update(
      { username, email, phoneNumber, gender, birthDate },
      { where: { id: req.customer.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomerPic = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.customer.id != id) {
      createError('invaild customer', 400);
    }

    if (!req.files) {
      createError('customerPicture is required', 400);
    }

    const updateValue = {};
    const result = await cloudinary.upload(req.files.userPicture[0].path);

    if (req.customer.userPicture) {
      const splited = req.customer.userPicture.split('/');
      const publicId = splited[splited.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }

    updateValue.userPicture = result.secure_url;

    await Customer.update(updateValue, { where: { id: req.customer.id } });
    res.json(updateValue);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.userPicture) {
      fs.unlinkSync(req.files.userPicture[0].path);
    }
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.customer.id != id) {
      createError('invaild customer', 400);
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const customer = await Customer.findOne({
      where: {
        id: req.customer.id,
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
    await Customer.update(
      { password: hashedPassword },
      { where: { id: req.customer.id } }
    );
    res.json({ message: 'change password success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.customer.id != id) {
      createError('invaild customer', 400);
    }

    const result = await Customer.destroy({
      where: { id: id },
    });

    if (result === 0) {
      createError('customer with this id not found', 400);
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
