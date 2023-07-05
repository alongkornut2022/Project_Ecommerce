const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/:sellerIds/:productRatingId', commentController.createComment);
router.patch('/:sellerIds/:commentId', commentController.updateComment);
router.delete('/:sellerIds/:commentId', commentController.deleteComment);

module.exports = router;
