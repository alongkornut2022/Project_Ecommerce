const { QueryTypes, Op } = require('sequelize');
const { ProductItem, sequelize } = require('../models');
const createError = require('../utils/createError');

exports.createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productUnitprice,
      categoryId,
      stockId,
      imagesId,
      specId,
    } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productitems = await ProductItem.create({
      productName,
      productUnitprice,
      categoryId,
      stockId,
      imagesId,
      specId,
      sellerId: req.seller.id,
    });
    res.status(201).json({ productitems: productitems });
  } catch (err) {
    next(err);
  }
};

exports.getAllProductBySeller = async (req, res, next) => {
  try {
    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productSeller = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where sl.id = ${req.seller.id}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productSeller: productSeller });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const checkProductId = await ProductItem.findOne({
      where: {
        [Op.and]: [{ id: productId }, { sellerId: req.seller.id }],
      },
    });

    if (!checkProductId) {
      createError('invaild product', 400);
    }

    const productSeller = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where p.id = ${productId}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productSeller: productSeller });
  } catch (err) {
    next(err);
  }
};

exports.getProductByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const checkCategoryId = await ProductItem.findOne({
      where: {
        [Op.and]: [{ categoryId: categoryId }, { sellerId: req.seller.id }],
      },
    });

    if (!checkCategoryId) {
      createError('invaild category', 400);
    }

    const productByCategory = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where sl.id = ${req.seller.id} and p.category_id = ${categoryId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ productByCategory: productByCategory });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { productName, productUnitprice } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const checkProductId = await ProductItem.findOne({
      where: {
        [Op.and]: [{ id: productId }, { sellerId: req.seller.id }],
      },
    });

    if (!checkProductId) {
      createError('invaild product', 400);
    }

    await ProductItem.update(
      { productName, productUnitprice },
      { where: { id: productId } }
    );
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const { productId } = req.params;

//     if (req.seller.id != sellerId) {
//       createError('invaild seller', 400);
//     }

//     const checkProductId = await ProductItem.findOne({
//       where: {
//         [Op.and]: [{ id: productId }, { sellerId: req.seller.id }],
//       },
//     });

//     if (!checkProductId) {
//       createError('invaild product', 400);
//     }

//     const result = await ProductItem.destroy({
//       where: { id: productId, sellerId: req.seller.id },
//     });

//     if (result === 0) {
//       createError('seller with this id not found', 400);
//     }
//     res.status(204).json();
//   } catch (err) {
//     next(err);
//   }
// };
