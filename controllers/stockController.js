const { ProductStock } = require('../models');
const createError = require('../utils/createError');

exports.createProductStock = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { stockStart, alreadysold, inventory, productId } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const productstocks = await ProductStock.create({
      stockStart,
      alreadysold,
      inventory,
      productId,
    });
    res.status(201).json({ productstocks: productstocks });
  } catch (err) {
    next(err);
  }
};

exports.getProductStock = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const productStocks = await ProductStock.findAll({
      where: { id: id, productId: req.product.id },
    });
    res.json({ productStocks: productStocks });
  } catch (err) {
    next(err);
  }
};

exports.updateProductStock = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { instock, alreadysold } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    await ProductStock.update(
      { instock, alreadysold },
      { where: { id: id, id: req.productstock.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductStock = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }
  } catch (err) {
    next(err);
  }
};
