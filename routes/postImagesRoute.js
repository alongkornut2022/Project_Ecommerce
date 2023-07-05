const express = require('express');
const PostImagesController = require('../controllers/PostImagesController');
const uploadImageReview = require('../middlewares/uploadImageReview');

const router = express.Router();

router.post(
  '/:customerId',
  uploadImageReview.array('imageReview', { maxCount: 4 }),
  PostImagesController.createPostImages
);

router.patch(
  '/:customerId/:productRatingId/:postImagesId',
  uploadImageReview.array('imageReview', { maxCount: 4 }),
  PostImagesController.updatePostImages
);

router.delete(
  '/:customerId/:productRatingId/:postImagesId',
  PostImagesController.deletePostImages
);

module.exports = router;
