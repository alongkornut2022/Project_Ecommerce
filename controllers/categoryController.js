const { ProductCategory } = require('../models');
const createError = require('../utils/createError');

exports.createCategory = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { categoryName } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const categoryname = await ProductCategory.create({ categoryName });
    res.status(201).json({ categoryname: categoryname });
  } catch (err) {
    next(err);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const category = await ProductCategory.findAll({});
    res.json({ category: category });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { sellerId, categoryId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const category = await ProductCategory.findOne({
      where: { id: categoryId },
    });
    res.json({ category: category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { sellerId, categoryId } = req.params;
    const { categoryName } = req.body;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    await ProductCategory.update(
      { categoryName },
      { where: { id: categoryId } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { sellerId, categoryId } = req.params;

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const result = await ProductCategory.destroy({ where: { id: categoryId } });
    if (result === 0) {
      createError('customer with this id not found', 400);
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
