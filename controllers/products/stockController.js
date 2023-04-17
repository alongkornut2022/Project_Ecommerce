const { ProductItem, ProductStock } = require('../../models');
const createError = require('../../utils/createError');

exports.createProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stockStart, alreadysold, inventory } = req.body;

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

    const productstocks = await ProductStock.create({
      stockStart,
      alreadysold,
      inventory,
    });

    res.status(201).json({ productstocks: productstocks });
  } catch (err) {
    next(err);
  }
};

exports.updateProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stockStart, alreadysold, inventory } = req.body;

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

    await ProductStock.update(
      { stockStart, alreadysold, inventory },
      { where: { id: productItem.stockId } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

// exports.deleteProductStock = async (req, res, next) => {
//   try {
//     const { productId } = req.params;

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

//     const result = await ProductStock.destroy({
//       where: { id: productItem.stockId },
//     });

//     if (result === 0) {
//       createError('seller with this id not found', 400);
//     }
//     res.status(204).json();
//   } catch (err) {
//     next(err);
//   }
// };
