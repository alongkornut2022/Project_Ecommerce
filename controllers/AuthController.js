const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');
const { Customer } = require('../models');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isNumeric } = require('validator/lib/isNumeric');
const { default: isStrongPassword } = require('validator/lib/isStrongPassword');

exports.register = async (req, res, next) => {
  try {
    const { username, email, phoneNumber, password, confirmPassword } =
      req.body;

    const checkUsernames = username.search(/^[A-Za-z][A-Za-z0-9]{6,28}[^\W_]$/);
    if (checkUsernames) {
      createError('not format username', 400);
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
    const customer = await Customer.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const payload = {
      id: customer.id,
      // email: customer.email,
      // username: customer.username,
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

    res.json({ message: 'register success', token });

    // res.status(201).json({ message: 'register success' });
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
      const customer = await Customer.findOne({
        where: { email: emailOrPhoneNumber },
      });

      if (!customer) {
        createError('invaild email or phone Number or password', 400);
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        customer.password
      );
      if (!isCorrectPassword) {
        createError('invaild email or phone Number or password', 400);
      }

      const payload = {
        id: customer.id,
        // email: customer.email,
        // username: customer.username,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      res.json({ message: 'login success', token });
    }

    if (isNumeric(emailOrPhoneNumber)) {
      const customer = await Customer.findOne({
        where: { phoneNumber: emailOrPhoneNumber },
      });
      if (!customer) {
        createError('invaild email or phone Number or password', 400);
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        customer.password
      );
      if (!isCorrectPassword) {
        createError('invaild username or password', 400);
      }

      const payload = {
        id: customer.id,
        // email: customer.email,
        // username: customer.username,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
      res.json({ message: 'login success', token });
    }
  } catch (err) {
    next(err);
  }
};
