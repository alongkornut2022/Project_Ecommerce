const { ProductItem, ProductStock } = require('../../models');
const createError = require('../../utils/createError');

exports.updateAlreadysold = async (req, res, next) => {
  try {
    const { sellerId, productId } = req.params;
    const { sales } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    if (req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    const productItem = await ProductItem.findOne({
      where: {
        [Op.and]: [{ id: productId }, { sellerId: req.seller.id }],
      },
    });

    if (!productItem) {
      createError('invaild product', 400);
    }

    const productStockOld = await ProductStock.findOne({
      where: { id: productItem.dataValues.stockId },
    });

    const newInventory = productStockOld.dataValues.inventory - sales;
    const newAlreadysold = productStockOld.dataValues.alreadysold + sales;

    await ProductStock.update(
      { alreadysold: newAlreadysold, inventory: newInventory },
      { where: { id: productItem.dataValues.stockId } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};
