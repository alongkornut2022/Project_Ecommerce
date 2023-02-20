const jwt = require('jsonwebtoken');
const { Customer } = require('../models');
const createError = require('../utils/createError');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      createError('you are unauthorized', 401);
    }

    const [, token] = authorization.split(' ');
    if (!token) {
      createError('you are unauthorized', 401);
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    const decodedPayload = jwt.verify(token, secretKey);

    const customer = await Customer.findOne({
      where: { id: decodedPayload.id },
    });

    if (!customer) {
      createError('user not found', 400);
    }

    if (
      decodedPayload.iat * 1000 <
      new Date(customer.lastUpdatePassword).getTime()
    ) {
      createError('you sre unauthorized', 401);
    }

    req.customer = customer;
    next();
  } catch (err) {
    next(err);
  }
};
