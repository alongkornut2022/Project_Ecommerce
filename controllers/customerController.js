const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');
const { Customer, DeliveryAddress } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      phoneNumber,
      password,
      confirmPassword,
      createdAt,
      updatedAt,
    } = req.body;

    if (!password) {
      createError('password is require', 400);
    }

    if (password.legth < 8) {
      createError('password must be at least 8 character', 400);
    }

    if (password !== confirmPassword) {
      createError('password did not match', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Customer.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      createdAt,
      updatedAt,
    });
    res.status(201).json({ message: 'register success' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;
    if (!email && !phoneNumber) {
      createError('email or phone Number is require', 400);
    }

    if (!password) {
      createError('password is require', 400);
    }

    if (email) {
      const customer = await Customer.findOne({ where: { email } });
      console.log(customer);
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
        email: customer.email,
        username: customer.username,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      res.json({ message: 'login success', token });
    }

    if (phoneNumber) {
      const customer = await Customer.findOne({ where: { phoneNumber } });
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
        email: customer.email,
        username: customer.username,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
      res.json({ message: 'login success', token });
    }
  } catch (err) {
    next(err);
  }
};

// exports.updateCustomer = async (req, res, next) => {
//   try {
//     const { email, oldPassword, newPassword, confirmNewPassword, birthDate } =
//       req.body;

//     const isCorrectPassword = await bcrypt.compare(
//       oldPassword,
//       req.user.password
//     );
//     if (!isCorrectPassword) {
//       createError('invaild username or password', 400);
//     }

//     if (newPassword !== confirmNewPassword) {
//       createError('user is not found', 400);
//     }

//     const value = { email, birthDate };

//     if (newPassword) {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       value.lastUpdatePassword = new Date();
//       value.password = hashedPassword;
//     }

//     await User.update(value, { where: { id: req.user.id } });
//     res.json({ message: 'update success' });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.checkPassword = async (req, res, next) => {
//   try {
//     const { password } = req.body;
//     const isCorrectPassword = await bcrypt.compare(
//       password,
//       req.customer.password
//     );
//     if (!isCorrectPassword) {
//       createError('invaild password', 400);
//     }
//     res.json({ message: 'password is correct' });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.changePassword = async (req, res, next) => {
//   try {
//     const { newPassword, confirmNewPassword } = req.body;

//     if (newPassword !== confirmNewPassword) {
//       createError('user is not found', 400);
//     }
//   } catch (err) {
//     next(err);
//   }
// };

exports.addressBook = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      addressDetail,
      district,
      province,
      postcode,
      phoneNumber,
    } = req.body;
    const addressDelivery = await DeliveryAddress.create({
      firstName,
      lastName,
      addressDetail,
      district,
      province,
      postcode,
      phoneNumber,
      customerId: req.customer.id,
    });
    res.status(201).json({ addressDelivery: addressDelivery });
  } catch (err) {
    next(err);
  }
};
