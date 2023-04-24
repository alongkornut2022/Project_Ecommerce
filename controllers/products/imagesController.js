const fs = require('fs');
const { ProductItem, ProductImages, sequelize } = require('../../models');
const createError = require('../../utils/createError');
const cloudinary = require('../../utils/cloundinary');

exports.createProductImages = async (req, res, next) => {
  // const t = await sequelize.transaction();
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItems = await ProductItem.findOne({
      where: { id: productId },
    });

    if (productItems == null) {
      createError('is not product', 400);
    }

    if (!req.files) {
      createError('Product images is required', 400);
    }

    let uploadToClound = [];
    for (let item of req.files) {
      let path = await cloudinary.upload(item.path);
      uploadToClound.push(path);
    }

    const result = uploadToClound.map((item) => item.secure_url);

    const [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
    ] = result;

    const productImages = await ProductImages.create(
      {
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
      }
      // { transaction: t }
    );

    await ProductItem.update(
      { imagesId: productImages.id },
      { where: { id: productId } }
      // { transaction: t }
    );

    // await t.commit();

    res.status(201).json({ productImages });
  } catch (err) {
    // await t.rollback();
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.updateProductImages = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItems = await ProductItem.findOne({
      where: { id: productId },
    });

    if (productItems == null) {
      createError('is not product', 400);
    }

    if (!req.files) {
      createError('Product images is required', 400);
    }

    let uploadToClound = [];
    for (let item of req.files) {
      let path = await cloudinary.upload(item.path);
      uploadToClound.push(path);
    }

    const oldImages = await ProductImages.findOne({
      where: {
        id: productItems.imagesId,
      },
      attributes: {
        exclude: ['id'],
      },
    });

    const arrOldImages = [];
    if (oldImages) {
      const {
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
      } = oldImages;
      arrOldImages.push(image1);
      arrOldImages.push(image2);
      arrOldImages.push(image3);
      arrOldImages.push(image4);
      arrOldImages.push(image5);
      arrOldImages.push(image6);
      arrOldImages.push(image7);
      arrOldImages.push(image8);
      arrOldImages.push(image9);

      for (let item of arrOldImages) {
        if (item === null) {
        } else {
          const splited = item.split('/');
          const publicId = splited[splited.length - 1].split('.')[0];
          await cloudinary.destroy(publicId);
        }
      }
    }

    const result = uploadToClound.map((item) => item.secure_url);

    const [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
    ] = result;

    await ProductImages.update(
      {
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
      },
      { where: { id: productItems.imagesId } }
    );

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.deleteAllProductImagesById = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { productId } = req.params;
    // const { imagesId } = req.body;

    if (!req.seller.id) {
      createError('invaild seller', 400);
    }

    const productItems = await ProductItem.findOne({
      where: { id: productId },
    });

    if (productItems == null) {
      createError('is not product', 400);
    }

    const resultImageId = await ProductItem.update(
      { imagesId: '' },
      {
        where: { id: productId },
      },
      { transaction: t }
    );

    const resultImages = await ProductImages.destroy(
      {
        where: { id: productItems.imagesId },
      },
      { transaction: t }
    );

    if (resultImages === 0) {
      createError('seller with this id not found1', 400);
    }

    if (resultImageId === 0) {
      createError('seller with this id not found2', 400);
    }
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// exports.deleteOneProductImagesById = async (req, res, next) => {};
