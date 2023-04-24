const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

exports.getProductSearch = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const categoryName = keyword.shift();
    let resultCategoryName =
      'pc.category_name = ' + "'" + categoryName + "'" + ' ';

    const shiftKeyword = keyword.shift();
    let newKeyword = shiftKeyword.split(' ');
    let filterKeyword = newKeyword.filter((item) => item !== '');
    let mapKeyword = filterKeyword.map(
      (item) => 'p.product_name like ' + "'" + '%' + item + '%' + "'" + ' or '
    );
    let stringKeyword = mapKeyword.join('');
    let resultKeyword = stringKeyword.slice(0, stringKeyword.length - 3);
    let resultSearch = [];

    const orderBy = keyword.shift();

    if (categoryName == 'หมวดหมู่ทั้งหมด') {
      resultSearch = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt  from (product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id where ${resultKeyword} order by ${orderBy}`,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    if (categoryName !== 'หมวดหมู่ทั้งหมด') {
      resultSearch = await sequelize.query(
        // `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , pc.category_name categoryName, p.created_at createdAt  from ((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id where ${resultKeyword} having ${resultCategoryName} order by p.product_name desc `,
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , pc.category_name categoryName, p.created_at createdAt  from ((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id where ${resultKeyword} having ${resultCategoryName} order by ${orderBy}`,
        {
          type: QueryTypes.SELECT,
        }
      );
    }

    let changeToString = filterKeyword.join(' ');
    let newResultSearch = [];
    let sortResultSearch = [];
    resultSearch.forEach((item, index) => {
      if (
        item.productName.toLowerCase().includes(changeToString.toLowerCase(), 0)
      ) {
        newResultSearch.push(item);
        resultSearch.splice(index, 1);
      }
    });

    for (let i = 0; (i = filterKeyword.length); i++) {
      filterKeyword.pop();
      changeToString = filterKeyword.join(' ');
      resultSearch.forEach((item, index) => {
        if (
          item.productName
            .toLowerCase()
            .includes(changeToString.toLowerCase(), 0)
        ) {
          newResultSearch.push(item);
          resultSearch.splice(index, 1);
        }
      });
    }

    sortResultSearch = sortResultSearch.concat(newResultSearch, resultSearch);

    res.json({ sortResultSearch });
    // res.json({ resultSearch });
  } catch (err) {
    next(err);
  }
};
