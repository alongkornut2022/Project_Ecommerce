const express = require('express');
const customerController = require('../controllers/customerController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', customerController.register);
router.post('/login', customerController.login);
// router.put('/', authenticate, userController.updateCustomer);
// router.put('/', authenticate, userController.changepassword);
router.post('/addressbook', authenticate, customerController.addressBook);

module.exports = router;
