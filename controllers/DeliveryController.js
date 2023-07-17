const { Op } = require('sequelize');
const {
  PostcodeProvince,
  ShippingRatesStandard,
  ShippingRatesEms,
  Delivery,
} = require('../models');
const createError = require('../utils/createError');

exports.createDelivery = async (req, res, next) => {
  try {
    const { sellerId, customerId, cartIdsBySellers } = req.params;
    const { optionDelivery, deliveryPrice } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    // -------------------------------------//
    // const findCartIds = await Delivery.findOne({
    //   where: { cartIds: cartIdsBySellers },
    // });

    // if (findCartIds === null) {
    //   const deliverys = await Delivery.create({
    //     sellerId,
    //     deliveryOption: optionDelivery,
    //     deliveryPrice,
    //     cartIds: cartIdsBySellers,
    //   });

    //   res.json({ deliverys });
    // }

    // res.json({ message: 'data exist' });

    // -------------------------------------//

    const cartIdsBySellersStr = cartIdsBySellers.split(',');

    for (let item of cartIdsBySellersStr) {
      const findCartId = await Delivery.findAll({
        where: { cartIds: { [Op.substring]: `${item}` } },
      });

      if (findCartId) {
        for (let item of findCartId) {
          await Delivery.destroy({
            where: { id: item.dataValues.id },
          });
        }
      }
    }
    // -------------------------------------//

    const deliverys = await Delivery.create({
      sellerId,
      deliveryOption: optionDelivery,
      deliveryPrice,
      cartIds: cartIdsBySellers,
    });

    res.json({ deliverys });
  } catch (err) {
    next(err);
  }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const { cartIdsBySeller, customerId } = req.params;
    const { optionDelivery, deliveryPrice } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const findCartIdsBySeller = await Delivery.findOne({
      where: { cartIds: cartIdsBySeller },
    });

    if (findCartIdsBySeller === null) {
      res.json({ message: 'is not data' });
    }

    const deliverys = await Delivery.update(
      {
        deliveryOption: optionDelivery,
        deliveryPrice,
      },
      { where: { cartIds: cartIdsBySeller } }
    );

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.getDeliveryPrice = async (req, res, next) => {
  try {
    const { cartIds, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const newCartIds = cartIds.split(',');

    const deliveryItem = [];
    for (let item of newCartIds) {
      let i = await Delivery.findOne({
        where: { cartIds: { [Op.substring]: `${item}` } },
      });
      deliveryItem.push(i);
    }

    const deliveryIds = deliveryItem.map((item) => item.dataValues.id);

    const newDeliveryIds = [...new Set(deliveryIds)];

    const deliverys = [];
    for (let item of newDeliveryIds) {
      let i = await Delivery.findOne({ where: { id: item } });
      deliverys.push(i);
    }

    const deliveryPrice = deliverys.reduce(
      (acc, item) => acc + item.dataValues.deliveryPrice,
      0
    );

    res.json({ deliveryPrice });
  } catch (err) {
    next(err);
  }
};

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

    if (shippingOption === 'เลือกประเภทการส่ง') {
      const deliveryPrice = 0;
      res.json({ deliveryPrice: deliveryPrice });
    }

    let newWeight = 0;
    if (weight <= 0 || weight === undefined || weight === null) {
      const deliveryPrice = 0;
      res.json({ deliveryPrice: deliveryPrice });
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

exports.getDeliveryCartIds = async (req, res, next) => {
  try {
    const { cartIdsBySeller, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const delivery = await Delivery.findOne({
      where: { cartIds: cartIdsBySeller },
    });

    const deliveryCartIds = delivery.dataValues.cartIds;

    console.log(deliveryCartIds);

    res.json({ deliveryCartIds });
  } catch (err) {
    console.log(err);
  }
};
