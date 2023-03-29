const { QueryTypes } = require('sequelize');
const {
  ProductItem,
  ProductStock,
  ProductCategory,
  Seller,
  sequelize,
} = require('../models');

exports.getProductByCategory = async (req, res, next) => {};

exports.getProductBestBuy = async (req, res, next) => {
  try {
    const productBestBuy = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.product_images productImages, ps.alreadysold , ps.inventory, p.created_at createdAt  from product_item p join product_stock ps on p.id = ps.product_id order by ps.alreadysold desc;`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productBestBuy });
  } catch (err) {
    next(err);
  }
};

exports.getNewProduct = async (req, res, next) => {
  try {
    const newProduct = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.product_images productImages, ps.alreadysold alreadysold, ps.inventory, p.created_at createdAt  from product_item p join product_stock ps on p.id = ps.product_id order by p.created_at desc;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ newProduct });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productItem = await sequelize.query(
      `select p.id product_id, p.product_name, p.product_unitprice, p.product_images, p.category_id, p.seller_id, ps.stock_start, ps.alreadysold, ps.inventory, pc.category_name, sl.shop_name from ((product_item p join product_stock ps on p.id = ps.product_id) join product_category pc on p.category_id = pc.id) join seller sl on p.seller_id = sl.id where p.id = ${productId}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productItem });
  } catch (err) {
    next(err);
  }
};
