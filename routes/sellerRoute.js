const express = require('express');
const sellerController = require('../controllers/sellerController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', sellerController.getSellerMe);
router.patch('/:id', sellerController.updateSeller);
router.patch(
  '/profilepic/:id',
  upload.fields([{ name: 'shopPicture', maxCount: 1 }]),
  sellerController.updateSellerPic
);
router.delete('/:id', sellerController.deleteSeller);
router.patch('/changepassword/:id', sellerController.changePassword);

module.exports = router;
