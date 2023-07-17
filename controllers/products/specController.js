const fs = require('fs');
const createError = require('../../utils/createError');
const { ProductItem, ProductSpec } = require('../../models');

exports.createProductSpec = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }
    if (req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    if (!req.file) {
      createError('Product spec is required', 400);
    }

    const productSpecs = await ProductSpec.create({
      productSpec: req.file.path,
    });

    res.json({ productSpecs: productSpecs });
  } catch (err) {
    next(err);
  }
};

exports.updateProductSpec = async (req, res, next) => {
  let oldSpec;
  try {
    const { sellerId, productId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }
    if (req.seller.id != sellerId) {
      createError('invaild seller', 400);
    }

    const productItems = await ProductItem.findOne({
      where: { id: productId },
    });

    if (productItems === null) {
      createError('invaild product', 400);
    }

    if (
      productItems.id != productId ||
      req.seller.id != productItems.sellerId
    ) {
      createError('seller or product is incorrect', 400);
    }

    if (!req.file) {
      createError('Product spec is required', 400);
    }

    oldSpec = await ProductSpec.findOne({
      where: { id: productItems.specId },
      attributes: {
        exclude: ['id'],
      },
    });

    await ProductSpec.update(
      { productSpec: req.file.path },
      { where: { id: productItems.specId } }
    );

    res.json({ message: 'update spec success' });
  } catch (err) {
    next(err);
  } finally {
    if (oldSpec) {
      fs.unlinkSync(oldSpec.productSpec);
    }
  }
};
