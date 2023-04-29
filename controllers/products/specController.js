const fs = require('fs');
const createError = require('../../utils/createError');
const { ProductItem, ProductSpec } = require('../../models');

exports.createProductSpec = async (req, res, next) => {
  let oldSpec;
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
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
      createError('invaild seller or product', 400);
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

    const productSpecs = await ProductSpec.create({
      productSpec: req.file.path,
    });

    await ProductItem.update(
      { specId: productSpecs.id },
      { where: { id: productId } }
    );

    res.status(201).json({ productSpecs: productSpecs });
  } catch (err) {
    next(err);
  } finally {
    if (oldSpec) {
      fs.unlinkSync(oldSpec.productSpec);
    }
  }
};

exports.updateProductSpec = async (req, res, next) => {
  let oldSpec;
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
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

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  } finally {
    if (oldSpec) {
      fs.unlinkSync(oldSpec.productSpec);
    }
  }
};

// exports.deletetProductSpec = async (req, res, next) => {
//   try {
//     if (!req.seller.id) {
//       createError('invaild seller', 400);
//     }

//     const productItem = await ProductItem.findOne({
//       where: { id: productId },
//     });

//     if (!productItem) {
//       createError('invaild product', 400);
//     }

//     if (productItem.id != productId || req.seller.id != productItem.sellerId) {
//       createError('seller or product is incorrect', 400);
//     }

//     const result = await ProductSpec.destroy({
//       where: { id: productItem.specId },
//     });

//     if (result === 0) {
//       createError('seller with this id not found', 400);
//     }
//     res.status(204).json();
//   } catch (err) {
//     next(err);
//   }
// };
