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

    const checkFormatUsername = username.search(
      /^[A-Za-z][A-Za-z0-9_.-]{6,28}[^\W_]$/
    );

    if (checkFormatUsername) {
      createError('not Format Username', 400);
    }

    const checkUsername = await Customer.findOne({
      where: { username },
    });

    if (checkUsername != null) {
      createError('This Username already exists', 400);
    }

    if (!isEmail(email)) {
      createError('not Email');
    }

    const checkEmail = await Customer.findOne({
      where: { email },
    });

    if (checkEmail != null) {
      createError('This Email already exists', 400);
    }

    if (!isNumeric(phoneNumber) || phoneNumber.length !== 10) {
      createError('not Phone Number', 400);
    }

    const checkPhoneNumber = await Customer.findOne({
      where: { phoneNumber },
    });

    if (checkPhoneNumber != null) {
      createError('This Phone Number already exists', 400);
    }

    if (!password) {
      createError('Password is require', 400);
    }

    if (password.length < 8) {
      createError('Password must be at least 8 character', 400);
    }

    if (password !== confirmPassword) {
      createError('Password did not match', 400);
    }

    if (!isStrongPassword(password)) {
      createError('Password not strong', 400);
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
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

    res.json({ message: 'register success', token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrPhoneNumber, password } = req.body;

    if (!emailOrPhoneNumber) {
      createError('Email or Phone Number is require', 400);
    }

    if (!password) {
      createError('Password is require', 400);
    }

    if (isEmail(emailOrPhoneNumber)) {
      const customer = await Customer.findOne({
        where: { email: emailOrPhoneNumber },
      });

      if (!customer) {
        createError('Invaild Email or Phone Number or Password', 400);
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        customer.password
      );
      if (!isCorrectPassword) {
        createError('Invaild Email or Phone Number or Password', 400);
      }

      const payload = {
        id: customer.id,
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
        createError('Invaild Email or Phone Number or Password', 400);
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        customer.password
      );
      if (!isCorrectPassword) {
        createError('Invaild Email or Phone Number or Password', 400);
      }

      const payload = {
        id: customer.id,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
      res.json({ message: 'login success', token });
    } else {
      createError('Invaild Email or Phone Number or Password', 400);
    }
  } catch (err) {
    next(err);
  }
};
