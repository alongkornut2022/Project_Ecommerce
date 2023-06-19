const fs = require('fs/promises');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

exports.getProductSort = async (req, res, next) => {
  try {
    const { limit, offset, orderBy } = req.query;

    if (limit == '' && offset == '') {
      const productSort = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt, dis.id discountsId, dis.discounts discounts  from ((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id)  left join discounts dis on p.discounts_id = dis.id  order by ${orderBy} ${limit} ${offset}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSort });
    }

    const productSort = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt, dis.id discountsId, dis.discounts discounts  from ((product_item p left join product_stock ps on p.stock_id = ps.id)  left join product_images pi on p.images_id = pi.id) left join discounts dis on p.discounts_id = dis.id  order by ${orderBy} limit ${limit} offset ${offset}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productSort });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productItem = await sequelize.query(
      // `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9 from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where p.id = ${productId}`,
      // `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9, pspec.product_spec productSpec from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join product_spec pspec on p.spec_id = pspec.id) join seller sl on p.seller_id = sl.id where p.id = ${productId}`,
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.product_weight_piece productWeightPiece, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, sl.shop_picture shopPicture,  sl.created_at shopCreatedAt, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9, p.spec_id specId , pspec.product_spec productSpec, sa.id addressSellerId, sa.province province, dis.id discountsId, dis.discounts discounts from ((((((product_item p left join product_stock ps on p.stock_id = ps.id) left join product_category pc on p.category_id = pc.id) left join product_images pi on p.images_id = pi.id) left join product_spec pspec on p.spec_id = pspec.id) left join seller sl on p.seller_id = sl.id) left join seller_address sa on sl.id = sa.seller_id) left join discounts dis on p.discounts_id = dis.id  where p.id = ${productId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (productItem[0].productSpec) {
      const productSpecs = await fs.readFile(
        productItem[0].productSpec,
        'utf8'
      );
      res.json({ productItem, productSpecs });
    }
    res.json({ productItem });
  } catch (err) {
    next(err);
  }
};

exports.getAllProductBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const productSeller = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9, dis.id discountsId, dis.discounts discounts from ((((product_item p left join product_stock ps on p.stock_id = ps.id) left join product_category pc on p.category_id = pc.id) left join product_images pi on p.images_id = pi.id) left join seller sl on p.seller_id = sl.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${sellerId} `,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productSeller: productSeller });
  } catch (err) {
    next(err);
  }
};
