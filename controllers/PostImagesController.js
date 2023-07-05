const fs = require('fs');
const { QueryTypes, Op } = require('sequelize');
const { ProductRating, PostImages, sequelize } = require('../models');
const createError = require('../utils/createError');
const cloudinary = require('../utils/cloundinary');

exports.createPostImages = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    if (!req.files) {
      createError('invaild Post Images', 400);
    }

    let uploadToClound = [];
    for (let item of req.files) {
      let path = await cloudinary.upload(item.path);
      uploadToClound.push(path);
    }

    const result = uploadToClound.map((item) => item.secure_url);
    const [image1, image2, image3, image4] = result;

    const postImages = await PostImages.create({
      image1,
      image2,
      image3,
      image4,
    });
    res.json({ postImages });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.updatePostImages = async (req, res, next) => {
  try {
    const { customerId, productRatingId, postImagesId } = req.params;
    const { indexImageUpdateStr, indexImageNullStr } = req.query;

    if (!req.customer) {
      createError('is not seller', 400);
    }
    if (req.customer.id === customerId) {
      createError('invaild seller', 400);
    }

    const productRating = await ProductRating.findOne({
      where: { id: productRatingId },
    });

    if (productRating == null) {
      createError('is not productRating', 400);
    }

    if (!req.files) {
      createError('Post images is required', 400);
    }

    const indexImageUpdate = indexImageUpdateStr.split(',');
    const indexImageNull = indexImageNullStr.split(',');

    // console.log(indexImageUpdate);
    // console.log(indexImageNull);

    const oldImages = await PostImages.findOne({
      where: {
        id: postImagesId,
      },
      attributes: {
        exclude: ['id'],
      },
    });

    // push old image arr

    if (oldImages === null) {
      createError('Post images is not exist', 400);
    }

    const { image1, image2, image3, image4 } = oldImages;

    const arrOldImages = [];
    arrOldImages.push(image1);
    arrOldImages.push(image2);
    arrOldImages.push(image3);
    arrOldImages.push(image4);

    // delete old image update

    const delOldImageUpdate = [];

    for (let item of indexImageUpdate) {
      delOldImageUpdate.push(arrOldImages[item]);
    }
    for (let item of indexImageNull) {
      delOldImageUpdate.push(arrOldImages[item]);
    }

    for (let item of delOldImageUpdate) {
      if (item === null || item === undefined) {
      } else {
        const splited = item.split('/');
        const publicId = splited[splited.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
    }

    // add image update

    let uploadToClound = [];
    for (let item of req.files) {
      let path = await cloudinary.upload(item.path);
      uploadToClound.push(path);
    }
    const newImagesUpdate = uploadToClound.map((item) => item.secure_url);

    for (let index in indexImageUpdate) {
      arrOldImages.splice(indexImageUpdate[index], 1, newImagesUpdate[index]);
    }

    for (let index in indexImageNull) {
      arrOldImages.splice(indexImageNull[index], 1, null);
    }

    const [newImage1, newImage2, newImage3, newImage4] = arrOldImages;

    await PostImages.update(
      {
        image1: newImage1,
        image2: newImage2,
        image3: newImage3,
        image4: newImage4,
      },
      { where: { id: postImagesId } }
    );

    res.json({ message: 'update Post Images success' });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.deletePostImages = async (req, res, next) => {
  try {
    const { customerId, productRatingId, postImagesId } = req.params;

    if (!req.customer) {
      createError('is not seller', 400);
    }

    if (req.customer.id === customerId) {
      createError('invaild seller', 400);
    }

    const productRating = await ProductRating.findOne({
      where: {
        [Op.and]: {
          id: productRatingId,
          customerId: customerId,
          postImagesId: postImagesId,
        },
      },
    });

    if (productRating == null) {
      createError('is not Product Rating', 400);
    }

    const oldImages = await PostImages.findOne({
      where: {
        id: postImagesId,
      },
      attributes: {
        exclude: ['id'],
      },
    });

    if (oldImages === null) {
      createError('Post images is not exist', 400);
    }

    const { image1, image2, image3, image4 } = oldImages;

    const arrOldImages = [];
    arrOldImages.push(image1);
    arrOldImages.push(image2);
    arrOldImages.push(image3);
    arrOldImages.push(image4);

    for (let item of arrOldImages) {
      if (item === null || item === undefined) {
      } else {
        const splited = item.split('/');
        const publicId = splited[splited.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
    }

    await PostImages.destroy({ where: { id: postImagesId } });
  } catch (err) {
    next(err);
  }
};
