const express = require('express');
const customerController = require('../controllers/customerController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', customerController.getCustomerMe);
router.patch('/:id', customerController.updateCustomer);
router.patch(
  '/profilepic/:id',
  upload.fields([{ name: 'userPicture', maxCount: 1 }]),
  customerController.updateCustomerPic
);
router.delete('/:id', customerController.deleteCustomer);

router.patch('/password/:id', customerController.changePassword);

module.exports = router;
