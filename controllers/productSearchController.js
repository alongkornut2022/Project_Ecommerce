const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

exports.getProductSearch = async (req, res, next) => {
  try {
    const { categorySearch, keySearch, limit, offset, orderBy } = req.query;

    let resultCategoryName =
      'pc.category_name = ' + "'" + categorySearch + "'" + ' ';

    let newKeyword = keySearch.split(' ');
    let filterKeyword = newKeyword.filter((item) => item !== '');
    let mapKeyword = filterKeyword.map(
      (item) => 'p.product_name like ' + "'" + '%' + item + '%' + "'" + ' or '
    );
    let stringKeyword = mapKeyword.join('');
    let resultKeyword = stringKeyword.slice(0, stringKeyword.length - 3);

    let resultSearch = [];

    if (limit == '' || offset == '') {
      // no limit , no offset
      if (categorySearch == 'หมวดหมู่ทั้งหมด') {
        // no category
        resultSearch = await sequelize.query(
          `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt, dis.id discountsId, dis.discounts discounts   from ((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) left join discounts dis on p.discounts_id = dis.id where ${resultKeyword} and p.product_status = 'selling' and ps.inventory > 0  order by ${orderBy} ${limit} ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
      }

      if (categorySearch !== 'หมวดหมู่ทั้งหมด') {
        // set Category
        resultSearch = await sequelize.query(
          `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , pc.category_name categoryName, p.created_at createdAt, dis.id discountsId, dis.discounts discounts   from (((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id) left join discounts dis on p.discounts_id = dis.id  where ${resultKeyword} and p.product_status = 'selling' and ps.inventory > 0  having ${resultCategoryName} order by ${orderBy} ${limit} ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
      }

      // let changeToString = filterKeyword.join(' ');
      // let newResultSearch = [];
      // let sortResultSearch = [];
      // resultSearch.forEach((item, index) => {
      //   if (
      //     item.productName
      //       .toLowerCase()
      //       .includes(changeToString.toLowerCase(), 0)
      //   ) {
      //     newResultSearch.push(item);
      //     resultSearch.splice(index, 1);
      //   }
      // });

      // for (let i = 0; (i = filterKeyword.length); i++) {
      //   filterKeyword.pop();
      //   changeToString = filterKeyword.join(' ');
      //   resultSearch.forEach((item, index) => {
      //     if (
      //       item.productName
      //         .toLowerCase()
      //         .includes(changeToString.toLowerCase(), 0)
      //     ) {
      //       newResultSearch.push(item);
      //       resultSearch.splice(index, 1);
      //     }
      //   });
      // }

      // sortResultSearch = sortResultSearch.concat(newResultSearch, resultSearch);

      const sortResultSearch = resultSearch;

      res.json({ sortResultSearch });
    } else {
      // มี limit , offset
      if (categorySearch == 'หมวดหมู่ทั้งหมด') {
        resultSearch = await sequelize.query(
          `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , p.created_at createdAt, dis.id discountsId, dis.discounts discounts  from ((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) left join discounts dis on p.discounts_id = dis.id  where ${resultKeyword} and p.product_status = 'selling' and ps.inventory > 0  order by ${orderBy} limit ${limit} offset ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
      }

      if (categorySearch !== 'หมวดหมู่ทั้งหมด') {
        resultSearch = await sequelize.query(
          `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, ps.alreadysold , ps.inventory, pi.image1 , pc.category_name categoryName, p.created_at createdAt, dis.id discountsId, dis.discounts discounts   from (((product_item p join product_stock ps on p.stock_id = ps.id)  join product_images pi on p.images_id = pi.id) join product_category pc on p.category_id = pc.id) left join discounts dis on p.discounts_id = dis.id  where ${resultKeyword} and p.product_status = 'selling' and ps.inventory > 0  having ${resultCategoryName} order by ${orderBy} limit ${limit} offset ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
      }

      // let changeToString = filterKeyword.join(' ');
      // console.log('changeToString', changeToString);
      // let newResultSearch = [];
      // let sortResultSearch = [];
      // resultSearch.forEach((item, index) => {
      //   if (
      //     item.productName.toLowerCase().includes(changeToString.toLowerCase())
      //   ) {
      //     newResultSearch.push(item);
      //     resultSearch.splice(index, 1);
      //   } else {
      //   }
      // });

      // for (let i = 1; (i = filterKeyword.length); i++) {
      //   filterKeyword.pop();
      //   changeToString = filterKeyword.join(' ');
      //   resultSearch.forEach((item, index) => {
      //     if (
      //       item.productName
      //         .toLowerCase()
      //         .includes(changeToString.toLowerCase(), 0)
      //     ) {
      //       newResultSearch.push(item);
      //       resultSearch.splice(index, 1);
      //     } else {
      //     }
      //   });
      // }

      // sortResultSearch = sortResultSearch.concat(newResultSearch, resultSearch);

      const sortResultSearch = resultSearch;

      res.json({ sortResultSearch });
    }
  } catch (err) {
    next(err);
  }
};
