const { QueryTypes, Op } = require('sequelize');
const { ProductItem, Cart, Seller, sequelize } = require('../models');
const createError = require('../utils/createError');

exports.createCart = async (req, res, next) => {
  try {
    const { productId, customerId } = req.params;
    const {
      amount,
      productTotalPrice,
      productUnitprice,
      productWeightTotal,
      sellerId,
    } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const products = await ProductItem.findOne({ where: { id: productId } });
    if (!products) {
      createError('invaild product', 400);
    }

    const checkCart = await Cart.findOne({
      where: {
        [Op.and]: [{ customerId: customerId }, { productId: productId }],
      },
    });

    let addAmount = 0;
    let addProductTotalPrice = 0;
    let addProductWeightTotal = 0;
    if (checkCart) {
      addAmount = +checkCart.amount + amount;
      addProductTotalPrice = productUnitprice * addAmount;
      addProductWeightTotal = productWeightTotal * addAmount;
      await Cart.update(
        {
          amount: addAmount,
          productTotalPrice: addProductTotalPrice,
          productWeightTotal: addProductWeightTotal,
        },
        { where: { id: checkCart.id } }
      );
      res.json({ message: 'เพิ่มไปยังรถเข็นเรียบร้อยแล้ว' });
    } else {
      await Cart.create({
        customerId,
        productId,
        amount,
        productTotalPrice,
        productWeightTotal,
        sellerId,
      });
      res.json({ message: 'เพิ่มไปยังรถเข็นเรียบร้อยแล้ว' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllCart = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const carts = await sequelize.query(
      `select c.id cartId, c.customer_id customerId, c.product_id productId, c.amount amount, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, p.product_name productName, p.product_unitprice productUnitPrice, pi.image1 image, p.seller_id sellerId, s.shop_name shopName, ps.id stockId, ps.inventory inventory, c.created_at createdAt from (((cart c join product_item p on c.product_id = p.id) left join product_images pi on p.images_id = pi.id) left join product_stock ps on p.stock_id = ps.id )left join seller s on p.seller_id = s.id  where c.customer_id = ${customerId} `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ carts });
  } catch (err) {
    next(err);
  }
};

exports.getCartBySeller = async (req, res, next) => {
  try {
    const { cartIds, customerId } = req.params;

    const newCartIds = cartIds.split(',');

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const cartBySeller = [];

    for (let item of newCartIds) {
      const cart = await sequelize.query(
        `select c.id cartId, c.customer_id customerId, c.product_id productId, c.seller_id sellerId, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, s.shop_name shopName, c.created_at createdAt, sa.id sellerAddressId, sa.district sellerDistrict, sa.province sellerProvince, sa.postcode sellerPostcode from (cart c left join seller s on c.seller_id = s.id) left join seller_address sa on s.id = sa.seller_id  where c.customer_id = ${customerId} and c.id = ${item}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      cartBySeller.push(cart[0]);
    }

    const productTotalPrice = cartBySeller.map(
      (item) => item.productTotalPrice
    );

    const newCartSeller = cartBySeller.map((item) => item.sellerId);

    const cartSellerIds = [...new Set(newCartSeller)];

    // const cartSellerIds = [];
    // cartSellerIds.push(newCartSeller[0]);
    // const compareNum = (a, b) => {
    //   if (a !== b) cartSellerIds.push(newCartSeller[b]);
    //   if (a === b) newCartSeller.splice(newCartSeller[b], 1);
    // };
    // newCartSeller.sort(compareNum);

    const sellers = [];
    for (let item of cartSellerIds) {
      const seller = await sequelize.query(
        `select s.id sellerId, s.shop_name shopName, s.phone_number phoneNumber, s.shop_picture shopPicture, sa.id sellerAddressId, sa.district sellerDistrict, sa.province sellerProvince, sa.postcode sellerPostcode  from seller s left join seller_address sa on s.id = sa.seller_id where s.id = ${item}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      sellers.push(seller[0]);
    }

    res.json({ sellers, productTotalPrice });
  } catch (err) {
    next(err);
  }
};

exports.getCartCheckout = async (req, res, next) => {
  try {
    const { sellerId, cartIds, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const newCartIds = cartIds.split(',');
    const cartCheckout = [];
    for (let item of newCartIds) {
      const cart = await sequelize.query(
        `select c.id cartId, c.customer_id customerId, c.product_id productId, c.seller_id sellerId, c.amount amount, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, p.product_name productName, p.product_unitprice productUnitPrice, pi.image1 image, ps.id stockId, ps.inventory inventory, c.created_at createdAt from ((cart c join product_item p on c.product_id = p.id) left join product_images pi on p.images_id = pi.id) left join product_stock ps on p.stock_id = ps.id  where c.customer_id = ${customerId} and c.id = ${item} and c.seller_id = ${sellerId}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (cart[0]) {
        cartCheckout.push(cart[0]);
      }
    }

    res.json({ cartCheckout });
  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { cartId, customerId } = req.params;
    const { amountCart, productTotalPriceCart } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const checkCartId = await Cart.findOne({ where: { id: cartId } });

    if (!checkCartId) {
      createError('invaild cart', 400);
    }

    const cart = await Cart.update(
      { amount: amountCart, productTotalPrice: productTotalPriceCart },
      { where: { id: checkCartId.id } }
    );

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const { cartIds, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const newCartIds = cartIds.split(',');

    for (let item of newCartIds) {
      await Cart.destroy({ where: { id: item } });
    }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
