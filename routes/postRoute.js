const express = require('express');
const PostController = require('../controllers/PostController');
const uploadImageReview = require('../middlewares/uploadImageReview');
const customerAuthenticate = require('../middlewares/customerAuthenticate');

const router = express.Router();

router.post(
  '/:orderDetailId/:productId/:customerId',
  uploadImageReview.array('imageReview', { maxCount: 4 }),
  customerAuthenticate,
  PostController.createPost
);

router.patch(
  '/:orderDetailId/:productId/:customerId',
  uploadImageReview.array('imageReview', { maxCount: 4 }),
  customerAuthenticate,
  PostController.updatePost
);

router.get(
  '/:orderDetailId/:productId/:customerId',
  customerAuthenticate,
  PostController.getProductRating
);

router.get('/product/:productId/', PostController.getRatingByProduct);

router.get(
  '/images/:postImagesId/customerId/:customerId',
  customerAuthenticate,
  PostController.getPostImages
);

router.delete(
  '/:orderDetailId/:productId/:customerId',

  customerAuthenticate,
  PostController.deletePost
);

module.exports = router;
