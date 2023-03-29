const jwt = require('jsonwebtoken');
const { Seller } = require('../models');
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

    const seller = await Seller.findOne({
      where: { id: decodedPayload.id },
      attributes: {
        exclude: ['password'],
      },
    });

    if (!seller) {
      createError('user not found', 400);
    }

    if (
      decodedPayload.iat * 1000 <
      new Date(seller.lastUpdatePassword).getTime()
    ) {
      createError('you sre unauthorized', 401);
    }

    req.seller = seller;
    next();
  } catch (err) {
    next(err);
  }
};
