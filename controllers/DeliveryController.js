const { QueryTypes, Op } = require('sequelize');
const {
  ProductItem,
  Cart,
  PostcodeProvince,
  ShippingRatesStandard,
  ShippingRatesEms,
  sequelize,
} = require('../models');
const createError = require('../utils/createError');

exports.getPostcodeZone = async (req, res, next) => {
  try {
    const { customerId, postcode } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    if (!postcode) {
      createError('invaild customer', 400);
    }

    const newPostcode = postcode.substr(0, 2);

    const postcodeZone = await PostcodeProvince.findOne({
      where: { postcode: { [Op.like]: `${newPostcode}%` } },
    });

    res.json({ postcodeZone: postcodeZone.zoneGroup });
  } catch (err) {
    next(err);
  }
};

exports.getShippingRate = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { shippingOption, area, weight } = req.query;

    // console.log(shippingOption);
    // console.log(area);
    // console.log(weight);

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    if (
      shippingOption === undefined ||
      area === undefined ||
      weight === undefined
    ) {
      createError('invaild data', 400);
    }

    let newWeight = 0;
    if (weight <= 0 || weight === undefined || weight === null) {
      createError('invaild weight', 400);
    } else if (weight > 0 && weight <= 1000) {
      newWeight = 1000;
    } else if (weight > 1000 && weight <= 2000) {
      newWeight = 2000;
    } else if (weight > 2000 && weight <= 3000) {
      newWeight = 3000;
    } else if (weight > 3000 && weight <= 4000) {
      newWeight = 4000;
    } else if (weight > 4000 && weight <= 5000) {
      newWeight = 5000;
    } else if (weight > 5000 && weight <= 6000) {
      newWeight = 6000;
    } else if (weight > 6000 && weight <= 7000) {
      newWeight = 7000;
    } else if (weight > 7000 && weight <= 8000) {
      newWeight = 8000;
    } else if (weight > 8000 && weight <= 9000) {
      newWeight = 9000;
    } else if (weight > 9000 && weight <= 10000) {
      newWeight = 10000;
    } else if (weight > 10000 && weight <= 11000) {
      newWeight = 11000;
    } else if (weight > 11000 && weight <= 12000) {
      newWeight = 12000;
    } else if (weight > 12000 && weight <= 13000) {
      newWeight = 13000;
    } else if (weight > 13000 && weight <= 14000) {
      newWeight = 14000;
    } else if (weight > 14000 && weight <= 15000) {
      newWeight = 15000;
    } else if (weight > 15000 && weight <= 16000) {
      newWeight = 16000;
    } else if (weight > 16000 && weight <= 17000) {
      newWeight = 17000;
    } else if (weight > 17000 && weight <= 18000) {
      newWeight = 18000;
    } else if (weight > 18000 && weight <= 19000) {
      newWeight = 19000;
    } else {
      newWeight = 20000;
    }

    let index;
    if (area === 'areaG1') {
      index = 2;
    } else if (area === 'areaG2') {
      index = 3;
    } else if (area === 'areaG3') {
      index = 4;
    }

    if (shippingOption === 'Standard Delivery-ส่งธรรมดา') {
      const shippingRates = await ShippingRatesStandard.findOne({
        where: { weight: newWeight },
      });

      const valueShippingRates = Object.values(shippingRates.dataValues);
      const deliveryPrice = valueShippingRates[index];

      res.json({ deliveryPrice });
    }

    if (shippingOption === 'EMS') {
      const shippingRates = await ShippingRatesEms.findOne({
        where: { weight: newWeight },
      });

      const valueShippingRates = Object.values(shippingRates.dataValues);
      const deliveryPrice = valueShippingRates[index];

      res.json({ deliveryPrice });
    }
  } catch (err) {
    next(err);
  }
};
