const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');
const { Seller } = require('../models');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isNumeric } = require('validator/lib/isNumeric');
const { default: isStrongPassword } = require('validator/lib/isStrongPassword');

exports.register = async (req, res, next) => {
  try {
    const { shopName, email, phoneNumber, password, confirmPassword } =
      req.body;

    const checkShopnames = shopName.search(/^[A-Za-z][A-Za-z0-9]{6,28}[^\W_]$/);
    if (checkShopnames) {
      createError('not format shopname', 400);
    }

    if (!isEmail(email)) {
      createError('not email');
    }

    if (!isNumeric(phoneNumber) || phoneNumber.length !== 10) {
      createError('not Phone Number', 400);
    }

    if (!password) {
      createError('password is require', 400);
    }

    if (password.length < 8) {
      createError('password must be at least 8 character', 400);
    }

    if (password !== confirmPassword) {
      createError('password did not match', 400);
    }

    if (!isStrongPassword(password)) {
      createError('password not strong', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await Seller.create({
      shopName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const payload = {
      id: seller.id,
      // email: seller.email,
      // shopname: seller.shopName,
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const tokenSeller = jwt.sign(payload, secretKey, { expiresIn: '30d' });

    res.json({ message: 'register success', tokenSeller });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrPhoneNumber, password } = req.body;
    if (!emailOrPhoneNumber) {
      createError('email or phone Number is require', 400);
    }

    if (!password) {
      createError('password is require', 400);
    }

    if (isEmail(emailOrPhoneNumber)) {
      const seller = await Seller.findOne({
        where: { email: emailOrPhoneNumber },
      });

      if (!seller) {
        createError('invaild email or phone Number or password', 400);
      }
      const isCorrectPassword = await bcrypt.compare(password, seller.password);
      if (!isCorrectPassword) {
        createError('invaild email or phone Number or password', 400);
      }

      const payload = {
        id: seller.id,
        // email: seller.email,
        // shopName: seller.shopName,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const tokenSeller = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      res.json({ message: 'login success', tokenSeller });
    }

    if (isNumeric(emailOrPhoneNumber)) {
      const seller = await Seller.findOne({
        where: { phoneNumber: emailOrPhoneNumber },
      });
      if (!seller) {
        createError('invaild email or phone Number or password', 400);
      }
      const isCorrectPassword = await bcrypt.compare(password, seller.password);
      if (!isCorrectPassword) {
        createError('invaild username or password', 400);
      }

      const payload = {
        id: seller.id,
        // email: seller.email,
        // shopName: seller.shopName,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const tokenSeller = jwt.sign(payload, secretKey, { expiresIn: '30d' });
      res.json({ message: 'login success', tokenSeller });
    }
  } catch (err) {
    next(err);
  }
};
