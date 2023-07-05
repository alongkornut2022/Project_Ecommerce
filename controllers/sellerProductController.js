const fs = require('fs');
const { QueryTypes, Op } = require('sequelize');
const {
  ProductItem,
  ProductStock,
  ProductCategory,
  ProductSpec,
  sequelize,
} = require('../models');
const createError = require('../utils/createError');

exports.createProduct = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const {
      selectCategory,
      productName,
      productUnitPrice,
      productWeight,
      productSpec,
      productStock,
      productImagesId,
      productStatus,
    } = req.body;

    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    const category = await ProductCategory.findOne({
      where: { categoryName: selectCategory },
    });

    const stock = await ProductStock.create({
      stockStart: productStock,
      alreadysold: 0,
      inventory: productStock,
    });

    const spec = await ProductSpec.create({ productSpec: productSpec });

    const productItem = await ProductItem.create({
      productName: productName,
      productUnitprice: productUnitPrice,
      productWeightPiece: productWeight,
      productStatus: productStatus,
      sellerId: sellerId,
      categoryId: category.dataValues.id,
      stockId: stock.dataValues.id,
      imagesId: productImagesId,
      specId: spec.dataValues.id,
    });
    res.json({ productItem });
  } catch (err) {
    next(err);
  }
};

// exports.createProduct = async (req, res, next) => {
//   // const t = await sequelize.transaction();
//   try {
//     const { sellerId } = req.params;
//     const {
//       productName,
//       productUnitprice,
//       categoryId,
//       stockId,
//       imagesId,
//       specId,
//       stockStart,
//       alreadysold,
//       inventory,
//       productWeightPiece,
//     } = req.body;

//     if (!req.seller) {
//       createError('is not seller', 400);
//     }
//     if (req.seller.id === sellerId) {
//       createError('invaild seller', 400);
//     }

//     const productitems = await ProductItem.create(
//       {
//         productName,
//         productUnitprice,
//         categoryId,
//         stockId,
//         imagesId,
//         specId,
//         productWeightPiece,
//         sellerId: req.seller.id,
//       }
//       // { transaction: t }
//     );
//     // res.status(201).json({ productitems: productitems });

//     const productstocks = await ProductStock.create(
//       {
//         stockStart,
//         alreadysold,
//         inventory,
//       }
//       // { transaction: t }
//     );

//     await ProductItem.update(
//       { stockId: productstocks.id },
//       { where: { id: productitems.id } }
//       // { transaction: t }
//     );

//     const products = await ProductItem.findOne({
//       where: { id: productitems.id },
//     });

//     // await t.commit();

//     res.status(201).json({ products: products });
//   } catch (err) {
//     // await t.rollback();
//     next(err);
//   }
// };

exports.getAllProductBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.query;

    if (!req.seller) {
      createError('is not seller', 400);
    }

    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    if (status === 'ทั้งหมด') {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} order by p.updated_at desc  ;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    } else {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} and p.product_status = '${status}' order by p.updated_at desc  ;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    }
  } catch (err) {
    next(err);
  }
};

// exports.getSearchProductBySeller = async (req, res, next) => {
//   try {
//     const { sellerId } = req.params;
//     const { keyword, navBar } = req.query;

//     if (!req.seller) {
//       createError('is not seller', 400);
//     }

//     if (!req.seller.id === sellerId) {
//       createError('invaild seller', 400);
//     }

//     if (navBar === 'ทั้งหมด') {
//       const productSeller = await sequelize.query(
//         `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts  from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where sl.id) left join discounts dis on p.discounts_id = dis.id = ${req.seller.id} and p.product_name like '%${keyword}%' order by p.updated_at desc  ;`,
//         {
//           type: QueryTypes.SELECT,
//         }
//       );
//       res.json({ productSeller: productSeller });
//     } else {
//       const productSeller = await sequelize.query(
//         `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts  from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} and p.product_name like '%${keyword}%' and p.product_status = '${navBar}' order by p.updated_at desc  ;`,
//         {
//           type: QueryTypes.SELECT,
//         }
//       );
//       res.json({ productSeller: productSeller });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

exports.getSearchProductBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const {
      navBar,
      productName,
      selectCategory,
      priceStart,
      priceTo,
      stockstartStart,
      stockstartTo,
      inventoryStart,
      inventoryTo,
      alreadysoldStart,
      alreadysoldTo,
    } = req.query;

    if (!req.seller) {
      createError('is not seller', 400);
    }

    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    let opProductName;
    let opCategory;
    let opPrice;
    let opStockstart;
    let opInventory;
    let opAlreadysold;

    if (productName === '') {
      opProductName = ' ';
    } else {
      opProductName =
        'and p.product_name like' +
        ' ' +
        "'" +
        '%' +
        productName +
        '%' +
        "'" +
        ' ';
    }

    if (selectCategory === 'หมวดหมู่ทั้งหมด') {
      opCategory = ' ';
    } else if (selectCategory != 'หมวดหมู่ทั้งหมด') {
      opCategory =
        'and cat.category_name =' + ' ' + "'" + selectCategory + "'" + ' ';
    }

    if (priceStart === '' && priceTo === '') {
      opPrice = ' ';
    } else if (priceStart != '' && priceTo === '') {
      opPrice = 'and p.product_unitprice =' + ' ' + priceStart;
    } else if (priceStart === '' && priceTo != '') {
      opPrice = 'and p.product_unitprice =' + ' ' + priceTo;
    } else if (priceStart != '' && priceTo != '') {
      opPrice =
        ' ' +
        'and p.product_unitprice between' +
        ' ' +
        priceStart +
        ' ' +
        'and' +
        ' ' +
        priceTo +
        ' ';
    }

    if (stockstartStart === '' && stockstartTo === '') {
      opStockstart = ' ';
    } else if (stockstartStart != '' && stockstartTo === '') {
      opStockstart = 'and ps.stock_start =' + ' ' + stockstartStart;
    } else if (stockstartStart === '' && stockstartTo != '') {
      opStockstart = 'and ps.stock_start =' + ' ' + stockstartTo;
    } else if (stockstartStart != '' && stockstartTo != '') {
      opStockstart =
        ' ' +
        'and ps.stock_start between' +
        ' ' +
        stockstartStart +
        ' ' +
        'and' +
        ' ' +
        stockstartTo +
        ' ';
    }

    if (inventoryStart === '' && inventoryTo === '') {
      opInventory = ' ';
    } else if (inventoryStart != '' && inventoryTo === '') {
      opInventory = 'and ps.inventory =' + ' ' + inventoryStart;
    } else if (inventoryStart === '' && inventoryTo != '') {
      opInventory = 'and ps.inventory =' + ' ' + inventoryTo;
    } else if (inventoryStart != '' && inventoryTo != '') {
      opInventory =
        ' ' +
        'and ps.inventory between' +
        ' ' +
        inventoryStart +
        ' ' +
        'and' +
        ' ' +
        inventoryTo +
        ' ';
    }

    if (alreadysoldStart === '' && alreadysoldTo === '') {
      opAlreadysold = ' ';
    } else if (alreadysoldStart != '' && alreadysoldTo === '') {
      opAlreadysold = 'and ps.alreadysold =' + ' ' + alreadysoldStart;
    } else if (alreadysoldStart === '' && alreadysoldTo != '') {
      opAlreadysold = 'and ps.alreadysold =' + ' ' + alreadysoldTo;
    } else if (alreadysoldStart != '' && alreadysoldTo != '') {
      opAlreadysold =
        ' ' +
        'and ps.alreadysold between' +
        ' ' +
        alreadysoldStart +
        ' ' +
        'and' +
        ' ' +
        alreadysoldTo +
        ' ';
    }

    if (navBar === 'ทั้งหมด') {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts  from (((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join product_category cat on p.category_id = cat.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} ${opProductName}  ${opCategory}  ${opPrice}  ${opStockstart}  ${opInventory}  ${opAlreadysold}  order by p.updated_at desc  ;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    } else {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts  from (((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join product_category cat on p.category_id = cat.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} and p.product_status = '${navBar}'  ${opProductName}  ${opCategory}  ${opPrice}  ${opStockstart}  ${opInventory}  ${opAlreadysold} order by p.updated_at desc  ;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    }
  } catch (err) {
    next(err);
  }
};

exports.getSortProductBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const {
      navBar,
      productName,
      selectCategory,
      priceStart,
      priceTo,
      stockstartStart,
      stockstartTo,
      inventoryStart,
      inventoryTo,
      alreadysoldStart,
      alreadysoldTo,
      sort,
    } = req.query;

    if (!req.seller) {
      createError('is not seller', 400);
    }

    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    let opProductName;
    let opCategory;
    let opPrice;
    let opStockstart;
    let opInventory;
    let opAlreadysold;

    if (productName === '') {
      opProductName = ' ';
    } else {
      opProductName =
        'and p.product_name like' +
        ' ' +
        "'" +
        '%' +
        productName +
        '%' +
        "'" +
        ' ';
    }

    if (selectCategory === 'หมวดหมู่ทั้งหมด') {
      opCategory = ' ';
    } else if (selectCategory != 'หมวดหมู่ทั้งหมด') {
      opCategory =
        'and cat.category_name =' + ' ' + "'" + selectCategory + "'" + ' ';
    }

    if (priceStart === '' && priceTo === '') {
      opPrice = ' ';
    } else if (priceStart != '' && priceTo === '') {
      opPrice = 'and p.product_unitprice =' + ' ' + priceStart;
    } else if (priceStart === '' && priceTo != '') {
      opPrice = 'and p.product_unitprice =' + ' ' + priceTo;
    } else if (priceStart != '' && priceTo != '') {
      opPrice =
        ' ' +
        'and p.product_unitprice between' +
        ' ' +
        priceStart +
        ' ' +
        'and' +
        ' ' +
        priceTo +
        ' ';
    }

    if (stockstartStart === '' && stockstartTo === '') {
      opStockstart = ' ';
    } else if (stockstartStart != '' && stockstartTo === '') {
      opStockstart = 'and ps.stock_start =' + ' ' + stockstartStart;
    } else if (stockstartStart === '' && stockstartTo != '') {
      opStockstart = 'and ps.stock_start =' + ' ' + stockstartTo;
    } else if (stockstartStart != '' && stockstartTo != '') {
      opStockstart =
        ' ' +
        'and ps.stock_start between' +
        ' ' +
        stockstartStart +
        ' ' +
        'and' +
        ' ' +
        stockstartTo +
        ' ';
    }

    if (inventoryStart === '' && inventoryTo === '') {
      opInventory = ' ';
    } else if (inventoryStart != '' && inventoryTo === '') {
      opInventory = 'and ps.inventory =' + ' ' + inventoryStart;
    } else if (inventoryStart === '' && inventoryTo != '') {
      opInventory = 'and ps.inventory =' + ' ' + inventoryTo;
    } else if (inventoryStart != '' && inventoryTo != '') {
      opInventory =
        ' ' +
        'and ps.inventory between' +
        ' ' +
        inventoryStart +
        ' ' +
        'and' +
        ' ' +
        inventoryTo +
        ' ';
    }

    if (alreadysoldStart === '' && alreadysoldTo === '') {
      opAlreadysold = ' ';
    } else if (alreadysoldStart != '' && alreadysoldTo === '') {
      opAlreadysold = 'and ps.alreadysold =' + ' ' + alreadysoldStart;
    } else if (alreadysoldStart === '' && alreadysoldTo != '') {
      opAlreadysold = 'and ps.alreadysold =' + ' ' + alreadysoldTo;
    } else if (alreadysoldStart != '' && alreadysoldTo != '') {
      opAlreadysold =
        ' ' +
        'and ps.alreadysold between' +
        ' ' +
        alreadysoldStart +
        ' ' +
        'and' +
        ' ' +
        alreadysoldTo +
        ' ';
    }

    if (navBar === 'ทั้งหมด') {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts, p.product_status productStatus  from (((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join product_category cat on p.category_id = cat.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} ${opProductName}  ${opCategory}  ${opPrice}  ${opStockstart}  ${opInventory}  ${opAlreadysold}  order by ${sort}  ;`,

        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    } else {
      const productSeller = await sequelize.query(
        `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, p.product_status productStatus, dis.id discountsId, dis.discounts discounts, p.product_status productStatus   from (((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join product_category cat on p.category_id = cat.id) left join discounts dis on p.discounts_id = dis.id where sl.id = ${req.seller.id} and p.product_status = '${navBar}'  ${opProductName}  ${opCategory}  ${opPrice}  ${opStockstart}  ${opInventory}  ${opAlreadysold} order by ${sort}  ;`,

        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ productSeller: productSeller });
    }
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
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId, p.product_weight_piece productWeightPiece,  ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, sl.shop_picture shopPicture, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9, dis.id discountsId, dis.discounts discounts, p.product_status productStatus  from ((((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id) left join discounts dis on p.discounts_id = dis.id where p.id = ${productId}`,
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
      `select p.id productId, p.product_name productName, p.product_unitprice productUnitprice, p.stock_id stockId, p.product_weight_piece productWeightPiece, ps.stock_start stockStart, ps.alreadysold alreadysold, ps.inventory inventory, p.category_id categoryId, pc.category_name categoryName, p.seller_id sellerId, sl.shop_name shopName, p.images_id imagesId, pi.image1, pi.image2, pi.image3, pi.image4, pi.image5, pi.image6, pi.image7, pi.image8, pi.image9, p.product_status productStatus from (((product_item p join product_stock ps on p.stock_id = ps.id) join product_category pc on p.category_id = pc.id) join product_images pi on p.images_id = pi.id) join seller sl on p.seller_id = sl.id where sl.id = ${req.seller.id} and p.category_id = ${categoryId}`,
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
    const { sellerId, productId } = req.params;

    const {
      selectCategory,
      productName,
      productUnitPrice,
      productWeight,
      productSpec,
      productStock,
      productStatus,
    } = req.body;

    if (!req.seller.id === sellerId) {
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

    const category = await ProductCategory.findOne({
      where: { categoryName: selectCategory },
    });

    const productStockOld = await ProductStock.findOne({
      where: { id: productItem.dataValues.stockId },
    });

    const newInventory = productStock - productStockOld.dataValues.alreadysold;

    await ProductStock.update(
      {
        stockStart: productStock,
        inventory: newInventory,
      },
      { where: { id: productItem.dataValues.stockId } }
    );

    await ProductSpec.update(
      { productSpec: productSpec },
      { where: { id: productItem.dataValues.specId } }
    );

    await ProductItem.update(
      {
        productName: productName,
        productUnitprice: productUnitPrice,
        productWeightPiece: productWeight,
        productStatus: productStatus,
        categoryId: category.dataValues.id,
      },
      { where: { id: productItem.dataValues.id } }
    );

    res.json({ message: 'update product success' });
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
