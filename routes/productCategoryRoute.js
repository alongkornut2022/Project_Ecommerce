const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');

const router = express.Router();

router.get('/', productCategoryController.getAllCategory);
router.get('/sort', productCategoryController.getProductByCategory);

module.exports = router;
