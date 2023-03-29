const { QueryTypes } = require('sequelize');
const { ProductItem } = require('../models');
const createError = require('../utils/createError');

exports.createProductSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { productName, productUnitprice, categoryId } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const productitems = await ProductItem.create({
      productName,
      productUnitprice,
      categoryId,
      sellerId: req.seller.id,
    });
    res.status(201).json({ productitems: productitems });
  } catch (err) {
    next(err);
  }
};

exports.getAllProductSeller = async (req, res, next) => {
  try {
    const products = await ProductItem.findAll({
      where: { sellerId: req.seller.id },
    });
    res.json({ products: products });
  } catch (err) {
    next(err);
  }
};

exports.getProductByIdSeller = async (req, res, next) => {};

exports.getProductByCategorySeller = async (req, res, next) => {};

exports.updateProductSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { productName, productUnitprice } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    await ProductItem.update(
      { productName, productUnitprice },
      { where: { id: req.product.id } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const result = await ProductItem.destroy({
      where: { id: id, sellerId: req.seller.id },
    });

    if (result === 0) {
      createError('seller with this id not found', 400);
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
