const fs = require('fs');
const { ProductItem, ProductImages, sequelize } = require('../../models');
const createError = require('../../utils/createError');
const cloudinary = require('../../utils/cloundinary');

exports.createProductImages = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (!req.seller) {
      createError('is not seller', 400);
    }
    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
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
    const productImages = await ProductImages.create({
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
    });
    res.json({ productImages });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      req.files.map((item) => fs.unlinkSync(item.path));
    }
  }
};

exports.updateProductImages = async (req, res, next) => {
  try {
    const { sellerId, productId } = req.params;
    const { indexImageUpdateStr, indexImageNullStr } = req.query;

    if (!req.seller) {
      createError('is not seller', 400);
    }
    if (req.seller.id === sellerId) {
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

    const indexImageUpdate = indexImageUpdateStr.split(',');
    const indexImageNull = indexImageNullStr.split(',');

    console.log(indexImageUpdate);
    console.log(indexImageNull);

    const oldImages = await ProductImages.findOne({
      where: {
        id: productItems.imagesId,
      },
      attributes: {
        exclude: ['id'],
      },
    });

    // push old image arr

    if (oldImages === null) {
      createError('Product images is not exist', 400);
    }

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

    const arrOldImages = [];
    arrOldImages.push(image1);
    arrOldImages.push(image2);
    arrOldImages.push(image3);
    arrOldImages.push(image4);
    arrOldImages.push(image5);
    arrOldImages.push(image6);
    arrOldImages.push(image7);
    arrOldImages.push(image8);
    arrOldImages.push(image9);

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

    const [
      newImage1,
      newImage2,
      newImage3,
      newImage4,
      newImage5,
      newImage6,
      newImage7,
      newImage8,
      newImage9,
    ] = arrOldImages;

    await ProductImages.update(
      {
        image1: newImage1,
        image2: newImage2,
        image3: newImage3,
        image4: newImage4,
        image5: newImage5,
        image6: newImage6,
        image7: newImage7,
        image8: newImage8,
        image9: newImage9,
      },
      { where: { id: productItems.imagesId } }
    );

    res.json({ message: 'update images success' });
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

exports.deleteProductImagesById = async (req, res, next) => {
  try {
    const { sellerId, productImagesId } = req.params;

    if (!req.seller) {
      createError('is not seller', 400);
    }
    if (!req.seller.id === sellerId) {
      createError('invaild seller', 400);
    }

    const oldImages = await ProductImages.findOne({
      where: {
        id: productImagesId,
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

      await ProductImages.destroy({
        where: { id: productImagesId },
      });
    } else {
      createError('not found', 400);
    }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

/******/

// exports.createProductImages = async (req, res, next) => {
//   // const t = await sequelize.transaction();
//   try {
//     const { productId } = req.params;

//     if (!req.seller.id) {
//       createError('invaild seller', 400);
//     }

//     const productItems = await ProductItem.findOne({
//       where: { id: productId },
//     });

//     if (productItems == null) {
//       createError('is not product', 400);
//     }

//     if (!req.files) {
//       createError('Product images is required', 400);
//     }

//     let uploadToClound = [];
//     for (let item of req.files) {
//       let path = await cloudinary.upload(item.path);
//       uploadToClound.push(path);
//     }

//     const result = uploadToClound.map((item) => item.secure_url);

//     const [
//       image1,
//       image2,
//       image3,
//       image4,
//       image5,
//       image6,
//       image7,
//       image8,
//       image9,
//     ] = result;

//     const productImages = await ProductImages.create(
//       {
//         image1,
//         image2,
//         image3,
//         image4,
//         image5,
//         image6,
//         image7,
//         image8,
//         image9,
//       }
//       // { transaction: t }
//     );

//     await ProductItem.update(
//       { imagesId: productImages.id },
//       { where: { id: productId } }
//       // { transaction: t }
//     );

//     // await t.commit();

//     res.status(201).json({ productImages });
//   } catch (err) {
//     // await t.rollback();
//     next(err);
//   } finally {
//     if (req.files) {
//       req.files.map((item) => fs.unlinkSync(item.path));
//     }
//   }
// };
