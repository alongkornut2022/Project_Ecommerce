const express = require('express');
const CartController = require('../controllers/CartController');

const router = express.Router();

router.post('/:productId/:customerId', CartController.createCart);
router.get('/:customerId', CartController.getAllCart);
router.get(
  '/checkout/:sellerId/:cartIds/:customerId',
  CartController.getCartCheckout
);
router.get('/seller/:cartIds/:customerId', CartController.getCartBySeller);
router.patch('/:cartId/:customerId', CartController.updateCart);
router.delete('/:cartIds/:customerId', CartController.deleteCart);

module.exports = router;
