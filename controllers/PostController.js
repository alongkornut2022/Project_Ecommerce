const fs = require('fs');
const { QueryTypes, Op } = require('sequelize');
const { ProductRating, PostImages, Comment, sequelize } = require('../models');
const createError = require('../utils/createError');
// const cloudinary = require('../utils/cloundinary');

exports.createPost = async (req, res, next) => {
  try {
    const { orderDetailId, productId, customerId } = req.params;
    const { rating, checkboxUsername, postReview, postImagesId } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const checkProductRating = await ProductRating.findOne({
      where: {
        [Op.and]: {
          orderDetailId: orderDetailId,
          productId: productId,
          customerId: customerId,
        },
      },
    });

    if (checkProductRating !== null) {
      createError('Product Rating is exist', 400);
    }

    const inputPostReview = postReview ? postReview : null;
    const inputDisplayUsername = checkboxUsername ? checkboxUsername : 0;
    const inputPostImagesId = postImagesId ? postImagesId : null;

    const productRating = await ProductRating.create({
      productId,
      customerId,
      orderDetailId,
      postImagesId: inputPostImagesId,
      rating,
      postReview: inputPostReview,
      displayUsername: inputDisplayUsername,
    });
    res.json({ productRating });
  } catch (err) {
    next(err);
  }
};

exports.getRatingByOrder = async (req, res, next) => {
  try {
    const { customerId, orderDetailId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const orderRating = await ProductRating.findOne({
      where: {
        [Op.and]: {
          customerId,
          orderDetailId,
        },
      },
    });

    res.json({ orderRating });
  } catch (err) {
    next(err);
  }
};

exports.getProductRating = async (req, res, next) => {
  try {
    const { orderDetailId, productId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const productRating = await sequelize.query(
      `select pr.id productRatingId, pr.product_id productId, pr.customer_id customerId, pr.order_detail_id orderDetailId, pr.rating rating, pr.post_review postReview,  pr.display_username displayUsername, pr.post_images_id postImagesId, pi.image1 imageReview1,  pi.image2 imageReview2,  pi.image3 imageReview3,  pi.image4 imageReview4, pr.created_at createdAt from (product_rating pr left join post_images pi on pr.post_images_id = pi.id) left join product_item p on pr.product_id = p.id  where pr.product_id = ${productId} and pr.order_detail_id = ${orderDetailId} and pr.customer_id = ${customerId} ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ productRating });
  } catch (err) {
    next(err);
  }
};

exports.getRatingByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating } = req.query;

    if (rating === 'All') {
      const productRating = await sequelize.query(
        `select pr.id productRatingId, pr.product_id productId, pr.customer_id customerId, pr.rating rating, pr.post_review postReview, c.username username, c.user_picture userPicture, pr.display_username displayUsername, pi.id imageId, pi.image1 image1,  pi.image2 image2,  pi.image3 image3,  pi.image4 image4, pr.created_at createdAt, sl.id sellerId, com.id commentId, com.comment comment from ((((product_rating pr left join customer c on pr.customer_id = c.id) left join post_images pi on pr.post_images_id = pi.id) left join product_item p on pr.product_id = p.id) left join seller sl on p.seller_id = sl.id) left join comment com on pr.comment_id = com.id  where pr.product_id = ${productId} ;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.json({ productRating });
    } else {
      const productRating = await sequelize.query(
        `select pr.id productRatingId, pr.product_id productId, pr.customer_id customerId, pr.rating rating, pr.post_review postReview, c.username username, c.user_picture userPicture, pr.display_username displayUsername, pi.id imageId, pi.image1 image1,  pi.image2 image2,  pi.image3 image3,  pi.image4 image4, pr.created_at createdAt, sl.id sellerId, com.id commentId, com.comment comment from ((((product_rating pr left join customer c on pr.customer_id = c.id) left join post_images pi on pr.post_images_id = pi.id) left join product_item p on pr.product_id = p.id) left join seller sl on p.seller_id = sl.id) left join comment com on pr.comment_id = com.id where pr.product_id = ${productId} and pr.rating = ${rating} ;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.json({ productRating });
    }
  } catch (err) {
    next(err);
  }
};

exports.getProductRatingReview = async (req, res, next) => {
  try {
    const { productId, orderDetailId, customerId } = req.params;

    if (req.seller) {
      createError('invaildseller', 400);
    }

    let productRatingReview = await ProductRating.findOne({
      where: { productId, orderDetailId, customerId },
    });

    let comment;
    if (productRatingReview != null) {
      productRatingReview = productRatingReview;
      if (productRatingReview.dataValues.commentId) {
        comment = await Comment.findOne({
          where: { id: productRatingReview.dataValues.commentId },
        });
      } else {
        comment = '';
      }
    } else {
      productRatingReview = '';
      comment = '';
    }

    res.json({ productRatingReview, comment });
  } catch (err) {
    next(err);
  }
};

exports.getPostImages = async (req, res, next) => {
  try {
    const { postImagesId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const postImages = await PostImages.findOne({
      where: { id: postImagesId },
    });

    res.json({ postImages });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { customerId, productRatingId } = req.params;
    const { rating, postReview, checkboxUsername, postImagesId } = req.body;

    console.log(rating, postReview, checkboxUsername, postImagesId);

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const checkProductRating = await ProductRating.findOne({
      where: {
        [Op.and]: {
          id: productRatingId,
          customerId: customerId,
        },
      },
    });

    if (checkProductRating == null) {
      createError('Product Rating is not exist', 400);
    }

    let inputPostReview = postReview ? postReview : null;
    let inputDisplayUsername = checkboxUsername ? checkboxUsername : 0;

    console.log('168');

    if (postImagesId || postImagesId != undefined) {
      await ProductRating.update(
        {
          rating,
          postReview: inputPostReview,
          displayUsername: inputDisplayUsername,
          postImagesId,
        },
        { where: { id: productRatingId } }
      );
      console.log('179');
    } else {
      await ProductRating.update(
        {
          rating,
          postReview: inputPostReview,
          displayUsername: inputDisplayUsername,
        },
        { where: { id: productRatingId } }
      );
    }
    console.log('187');
    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { customerId, productRatingId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const checkProductRating = await ProductRating.findOne({
      where: {
        [Op.and]: {
          id: productRatingId,
          customerId: customerId,
        },
      },
    });

    if (checkProductRating == null) {
      createError('Product Rating is not exist', 400);
    }

    await ProductRating.destroy({ where: { id: productRatingId } });

    res.json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};
