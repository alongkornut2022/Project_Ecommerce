const express = require('express');
const ThaiAddressController = require('../controllers/ThaiAddressController');

const router = express.Router();

router.get('/provinces', ThaiAddressController.getThaiProvinces);
router.get('/amphures/:provinceId', ThaiAddressController.getThaiAmphures);
router.get('/tambons/:amphureId', ThaiAddressController.getThaiTambons);
router.get('/zipcodes/:tambonId', ThaiAddressController.getThaiZipCodes);
router.get('/total', ThaiAddressController.getThaiAddressId);

module.exports = router;
