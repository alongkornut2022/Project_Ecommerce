const { QueryTypes, Op } = require('sequelize');
const { ProductRating, Comment, sequelize } = require('../models');
const createError = require('../utils/createError');

exports.createComment = async (req, res, next) => {
  try {
    const { sellerIds, productRatingId } = req.params;
    const { commentWrite } = req.body;

    if (!req.seller.id === sellerIds) {
      createError('invaild seller');
    }

    const productRatingOld = await ProductRating.findOne({
      where: { id: productRatingId },
    });

    if (!productRatingOld) {
      createError('invalid Product Rating Id');
    }

    const commentItem = await Comment.create({
      comment: commentWrite,
      sellerId: sellerIds,
    });

    const productRating = await ProductRating.update(
      { commentId: commentItem.dataValues.id },
      { where: { id: productRatingId } }
    );
    res.json({ message: 'comment suceess' });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { sellerIds, commentId } = req.params;
    const { commentWrite } = req.body;

    if (!req.seller.id === sellerIds) {
      createError('invaild seller');
    }

    await Comment.update(
      { comment: commentWrite },
      { where: { id: commentId } }
    );

    res.json({ message: 'update suceess' });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { sellerIds, commentId } = req.params;

    if (!req.seller.id === sellerIds) {
      createError('invaild seller');
    }

    await Comment.destroy({ where: { id: commentId } });
    res.json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};
