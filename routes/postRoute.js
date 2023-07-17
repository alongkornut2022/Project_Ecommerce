const express = require('express');
const PostController = require('../controllers/PostController');
const postImagesRoute = require('../routes/postImagesRoute');

const customerAuthenticate = require('../middlewares/customerAuthenticate');

const router = express.Router();

router.post(
  '/:orderDetailId/:productId/:customerId',
  customerAuthenticate,
  PostController.createPost
);

router.patch(
  '/:customerId/:productRatingId',
  customerAuthenticate,
  PostController.updatePost
);

router.get(
  '/order/:customerId/:orderDetailId',
  customerAuthenticate,
  PostController.getRatingByOrder
);

router.get(
  '/:orderDetailId/:productId/:customerId',
  customerAuthenticate,
  PostController.getProductRating
);

router.get('/product/:productId/', PostController.getRatingByProduct);

router.get(
  '/productreview/:orderDetailId/:productId/:customerId',
  PostController.getProductRatingReview
);

router.get(
  '/images/:postImagesId/customerId/:customerId',
  customerAuthenticate,
  PostController.getPostImages
);

router.delete(
  '/:customerId/:productRatingId',
  customerAuthenticate,
  PostController.deletePost
);

router.use('/images', customerAuthenticate, postImagesRoute);

module.exports = router;
