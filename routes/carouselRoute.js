const express = require('express');
const carouselController = require('../controllers/carouselController');
const upload = require('../middlewares/upoladCarousel');
const sellerAuthenticate = require('../middlewares/sellerAuthenticate');
const router = express.Router();

router.post(
  '/',
  upload.single('carousel'),
  sellerAuthenticate,
  carouselController.createCarousel
);

router.get('/', carouselController.getCarousel);

router.patch(
  '/:carouselId',
  upload.single('carousel'),
  sellerAuthenticate,
  carouselController.updateCarousel
);

router.delete(
  '/:carouselId',
  sellerAuthenticate,
  carouselController.deleteCarousel
);

/******* Product Carousel Status *****/

router.patch(
  '/product/:productId',
  sellerAuthenticate,
  carouselController.productCarousel
);

router.get('/product', carouselController.getProductCarousel);

module.exports = router;
