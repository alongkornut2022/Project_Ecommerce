const express = require('express');
const CartController = require('../controllers/CartController');

const router = express.Router();

router.post('/:productId/:customerId', CartController.createCart);

router.get('/:customerId', CartController.getCartByCustomer);
router.get('/seller/:cartIds/:customerId', CartController.getCartBySeller);
router.get(
  '/product/:sellerId/:cartIds/:customerId',
  CartController.getCartProduct
);

router.patch('/:cartId/:customerId', CartController.updateCart);

router.delete('/:cartIds/:customerId', CartController.deleteCart);

module.exports = router;
