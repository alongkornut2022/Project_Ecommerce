const { ProductItem, Discounts } = require('../../models');
const createError = require('../../utils/createError');

exports.createDiscounts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { discounts } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: { id: productId },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    if (
      productItem.dataValues.id == productId &&
      req.seller.id == productItem.dataValues.sellerId
    ) {
      const productDiscounts = await Discounts.create({
        discounts,
      });

      await ProductItem.update(
        { discountsId: productDiscounts.dataValues.id },
        { where: { id: productId } }
      );

      res.status(201).json({ productDiscounts: productDiscounts });
    } else {
      createError('invaild seller or product', 400);
    }
  } catch (err) {
    next(err);
  }
};

exports.updateDiscounts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { discounts } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: { id: productId },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    if (
      productItem.dataValues.id == productId &&
      req.seller.id == productItem.dataValues.sellerId
    ) {
      await Discounts.update(
        { discounts },
        { where: { id: productItem.dataValues.discountsId } }
      );
      res.json({ message: 'update success' });
    } else {
      createError('seller or product is incorrect', 400);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteDiscounts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: { id: productId },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    if (
      productItem.dataValues.id == productId &&
      req.seller.id == productItem.dataValues.sellerId
    ) {
      await Discounts.destroy({
        where: { id: productItem.dataValues.discountsId },
      });

      res.status(204).json();
    } else {
      createError('seller or product is incorrect', 400);
    }
  } catch (err) {
    next(err);
  }
};
