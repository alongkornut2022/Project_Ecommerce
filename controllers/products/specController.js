const { ProductItem, ProductSpec } = require('../../models');
const createError = require('../../utils/createError');

exports.createProductSpec = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { productSpec } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: { id: productId },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    if (productItem.id != productId || req.seller.id != productItem.sellerId) {
      createError('invaild seller or product', 400);
    }

    const productSpecs = await ProductSpec.create({
      productSpec,
    });

    res.status(201).json({ productSpecs: productSpecs });
  } catch (err) {
    next(err);
  }
};

exports.updateProductSpec = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { productSpec } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: { id: productId },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    if (productItem.id != productId || req.seller.id != productItem.sellerId) {
      createError('seller or product is incorrect', 400);
    }

    await ProductSpec.update(
      { productSpec },
      { where: { id: productItem.specId } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
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
