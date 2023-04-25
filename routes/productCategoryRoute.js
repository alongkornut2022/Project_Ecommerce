const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');

const router = express.Router();

router.get('/', productCategoryController.getAllCategory);
router.get('/sort', productCategoryController.getProductByCategory);
router.get(
  '/sortbestbuy/bycategoryname',
  productCategoryController.getProductByCategorySortAlreadysold
);
router.get(
  '/sortlowprice/bycategoryname',
  productCategoryController.getProductByCategorySortPriceASC
);
router.get(
  '/sorthighprice/bycategoryname',
  productCategoryController.getProductByCategorySortPriceDESC
);

module.exports = router;
