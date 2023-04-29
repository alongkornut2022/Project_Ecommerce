const { QueryTypes } = require('sequelize');
const { ProductCategory, sequelize } = require('../models');

exports.getAllCategory = async (req, res, next) => {
  try {
    const category = await ProductCategory.findAll({
      attributes: [['id', 'categoryId'], 'categoryName'],
    });
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

exports.getProductByCategory = async (req, res, next) => {
  try {
    const { categoryName, limit, offset, orderBy } = req.query;

    if (limit == '' && offset == '') {
      const productByCategory = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold alreadysold, ps.inventory, pi.image1 , pc.id categoryId, pc.category_name CategoryName, p.created_at createdAt  from ((product_item p join product_stock ps on p.stock_id = ps.id) join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id where pc.category_name = '${categoryName}' order by ${orderBy} ${limit} ${offset}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productByCategory });
    }

    const productByCategory = await sequelize.query(
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold alreadysold, ps.inventory, pi.image1 , pc.id categoryId, pc.category_name CategoryName, p.created_at createdAt  from ((product_item p join product_stock ps on p.stock_id = ps.id) join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id where pc.category_name = '${categoryName}' order by ${orderBy} limit ${limit} offset ${offset}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json({ productByCategory });
  } catch (err) {
    next(err);
  }
};
