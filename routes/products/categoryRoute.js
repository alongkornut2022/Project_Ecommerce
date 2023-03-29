const express = require('express');
const categoryController = require('../../controllers/categoryController');

const router = express.Router();

router.post('/:sellerId', categoryController.createCategory);
router.get('/:sellerId', categoryController.getAllCategory);
router.get('/:sellerId/:categoryId', categoryController.getCategoryById);
router.patch('/:sellerId/:categoryId', categoryController.updateCategory);
router.delete('/:sellerId/:categoryId', categoryController.deleteCategory);

module.exports = router;
