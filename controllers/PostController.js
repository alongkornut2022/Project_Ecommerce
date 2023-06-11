const fs = require('fs');
const { QueryTypes, Op } = require('sequelize');
const { ProductRating, PostImages, Comment, sequelize } = require('../models');
const createError = require('../utils/createError');
const cloudinary = require('../utils/cloundinary');

exports.createPost = async (req, res, next) => {
  try {
    const { orderDetailId, productId, customerId } = req.params;
    const { rating, postReview, checkboxUsername } = req.query;

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

    // console.log(orderDetailId);
    // console.log(productId);
    // console.log(customerId);
    // console.log(rating);
    // console.log(postReview);
    // console.log(req.files);

    let postImages = [];
    if (req.files) {
      let uploadToClound = [];
      for (let item of req.files) {
        let path = await cloudinary.upload(item.path);
        uploadToClound.push(path);
      }

      const result = uploadToClound.map((item) => item.secure_url);
      const [image1, image2, image3, image4] = result;

      postImages = await PostImages.create({
        image1,
        image2,
        image3,
        image4,
      });
    }

    const productRating = await ProductRating.create({
      productId,
      customerId,
      orderDetailId,
      postImagesId: postImages.id,
      rating,
      postReview,
      displayUsername: checkboxUsername,
    });
    res.json({ productRating });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.getProductRating = async (req, res, next) => {
  try {
    const { orderDetailId, productId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    // const productRating = await ProductRating.findOne({
    //   where: {
    //     [Op.and]: {
    //       orderDetailId: orderDetailId,
    //       productId: productId,
    //       customerId: customerId,
    //     },
    //   },
    //   include: [{ model: PostImages }],
    // });

    const productRating = await sequelize.query(
      `select pr.id ratingId, pr.product_id productId, pr.customer_id customerId, pr.order_detail_id orderDetailId, pr.rating rating, pr.post_review postReview,  pr.display_username displayUsername, pr.post_images_id imagesId, pi.image1 image1,  pi.image2 image2,  pi.image3 image3,  pi.image4 image4, pr.created_at createdAt from product_rating pr left join post_images pi on pr.post_images_id = pi.id where pr.product_id = ${productId} and pr.order_detail_id = ${orderDetailId} and pr.customer_id = ${customerId} ;`,
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
        `select pr.id productRatingId, pr.product_id productId, pr.customer_id customerId, pr.rating rating, pr.post_review postReview, c.username username, c.user_picture userPicture, pr.display_username displayUsername, pi.id imageId, pi.image1 image1,  pi.image2 image2,  pi.image3 image3,  pi.image4 image4, pr.created_at createdAt from (product_rating pr left join customer c on pr.customer_id = c.id) left join post_images pi on pr.post_images_id = pi.id where pr.product_id = ${productId} ;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.json({ productRating });
    } else {
      const productRating = await sequelize.query(
        `select pr.id productRatingId, pr.product_id productId, pr.customer_id customerId, pr.rating rating, pr.post_review postReview, c.username username, c.user_picture userPicture, pr.display_username displayUsername, pi.id imageId, pi.image1 image1,  pi.image2 image2,  pi.image3 image3,  pi.image4 image4, pr.created_at createdAt from (product_rating pr left join customer c on pr.customer_id = c.id) left join post_images pi on pr.post_images_id = pi.id where pr.product_id = ${productId} and pr.rating = ${rating} ;`,
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
    const { orderDetailId, productId, customerId } = req.params;
    const { rating, postReview, checkboxUsername } = req.query;

    console.log('post', postReview);

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

    if (checkProductRating == null) {
      createError('Product Rating is not exist', 400);
    }

    let postImages;
    if (req.files) {
      let uploadToClound = [];
      for (let item of req.files) {
        let path = await cloudinary.upload(item.path);
        uploadToClound.push(path);
      }

      let result = uploadToClound.map((item) => item.secure_url);
      const [image1, image2, image3, image4] = result;

      if (checkProductRating.postImagesId != null) {
        await PostImages.update(
          { image1, image2, image3, image4 },
          { where: { id: checkProductRating.postImagesId } }
        );
      } else {
        postImages = await PostImages.create({
          image1,
          image2,
          image3,
          image4,
        });
      }
    }

    if (postImages) {
      await ProductRating.update(
        {
          postImagesId: postImages.id,
          rating,
          postReview,
          displayUsername: checkboxUsername,
        },
        { where: { id: checkProductRating.id } }
      );

      res.json({ message: 'update success' });
    } else if (postReview) {
      await ProductRating.update(
        {
          rating,
          postReview,
          displayUsername: checkboxUsername,
        },
        { where: { id: checkProductRating.id } }
      );

      res.json({ message: 'update success' });
    } else {
      await ProductRating.update(
        {
          rating,
          postReview,
          displayUsername: checkboxUsername,
        },
        { where: { id: checkProductRating.id } }
      );

      res.json({ message: 'update success' });
    }
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { orderDetailId, productId, customerId } = req.params;

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

    if (checkProductRating == null) {
      createError('Product Rating is not exist', 400);
    }

    await ProductRating.destroy({ where: { id: checkProductRating.id } });
    await PostImages.destroy({
      where: { id: checkProductRating.postImagesId },
    });

    res.json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};
