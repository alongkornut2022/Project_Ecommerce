const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

exports.getProductBestBuy = async (req, res, next) => {
  try {
    const productBestBuy = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt  from (product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id order by ps.alreadysold desc limit 10`,
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
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt  from (product_item p join product_stock ps on p.stock_id = ps.id) join product_images pi on p.images_id = pi.id order by p.created_at desc limit 10`,
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
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where p.id = ${productId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ productItem });
  } catch (err) {
    next(err);
  }
};

exports.getAllProductBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const productSeller = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where sl.id = ${sellerId} limit 10`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productSeller: productSeller });
  } catch (err) {
    next(err);
  }
};

exports.getProductSearch = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    console.log('1111' + keyword);

    const resultSearch = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt  from (product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id where p.product_name like '%${keyword}' or p.product_name like '${keyword}%' or p.product_name like '%${keyword}%' order by p.created_at desc `,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ resultSearch });
  } catch (err) {
    next(err);
  }
};
