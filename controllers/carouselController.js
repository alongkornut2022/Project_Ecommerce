const fs = require('fs');
const { QueryTypes } = require('sequelize');
const { CarouselBanner, ProductItem, sequelize } = require('../models');
const createError = require('../utils/createError');
const cloudinary = require('../utils/cloundinary');

exports.createCarousel = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (req.seller.id != 3) {
      createError('is not allowed', 400);
    }

    if (!req.file) {
      createError('Carousel is required', 400);
    }

    const uploadToClound = await cloudinary.upload(req.file.path);
    const carousel = uploadToClound.secure_url;

    const carouselBanner = await CarouselBanner.create({
      carousel,
      status,
    });

    res.status(201).json({ carouselBanner });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getCarousel = async (req, res, next) => {
  try {
    const { status } = req.query;

    const carouselBanner = await CarouselBanner.findAll({
      where: { status: status },
    });

    res.json({ carouselBanner });
  } catch (err) {
    next(err);
  }
};

exports.updateCarousel = async (req, res, next) => {
  try {
    const { carouselId } = req.params;
    const { status } = req.query;

    if (req.seller.id != 3) {
      createError('is not allowed', 400);
    }

    const carousels = await CarouselBanner.findOne({
      where: { id: carouselId },
    });

    if (carousels == null) {
      createError('is not carousel', 400);
    }

    if (!req.file) {
      createError('Carousel is required', 400);
    }

    const uploadToClound = await cloudinary.upload(req.file.path);
    const carousel = uploadToClound.secure_url;

    await CarouselBanner.update(
      {
        carousel,
        status,
      },
      { where: { id: carouselId } }
    );

    const splited = carousels.dataValues.carousel.split('/');
    const publicId = splited[splited.length - 1].split('.')[0];
    await cloudinary.destroy(publicId);

    res.json({ massage: 'update success' });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deleteCarousel = async (req, res, next) => {
  try {
    const { carouselId } = req.params;

    if (req.seller.id != 3) {
      createError('is not allowed', 400);
    }

    const carousels = await CarouselBanner.findOne({
      where: { id: carouselId },
    });

    if (carousels == null) {
      createError('is not carousel', 400);
    }

    const delCarousel = await CarouselBanner.destroy({
      where: { id: carouselId },
    });

    if (delCarousel === 1) {
      const splited = carousels.dataValues.carousel.split('/');
      const publicId = splited[splited.length - 1].split('.')[0];
      await cloudinary.destroy(publicId);
    }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

/********* Product Carousel Status *************** */

exports.productCarousel = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status } = req.query;

    if (req.seller.id != 3) {
      createError('is not allowed', 400);
    }

    const product = await ProductItem.findOne({ where: { id: productId } });

    if (product === null) {
      createError('is not product', 400);
    }

    await ProductItem.update(
      {
        carouselStatus: status,
      },
      { where: { id: productId } }
    );

    res.json({ massage: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.getProductCarousel = async (req, res, next) => {
  try {
    const { status } = req.query;

    const carouselBanner = await sequelize.query(
      `select p.id productId, pi.image1, p.carousel_status carouselStatus, dis.discounts discounts from (product_item p left join product_images pi on p.images_id = pi.id) left join discounts dis on p.discounts_id = dis.id  where p.carousel_status = '${status}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ carouselBanner });
  } catch (err) {
    next(err);
  }
};
