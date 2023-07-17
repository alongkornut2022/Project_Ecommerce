const { QueryTypes, Op } = require('sequelize');
const {
  ProductItem,
  ProductStock,
  Cart,
  Discounts,
  sequelize,
} = require('../models');
const createError = require('../utils/createError');

exports.createCart = async (req, res, next) => {
  try {
    const { productId, customerId } = req.params;
    const { amount, productWeightTotal, sellerId } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const products = await ProductItem.findOne({ where: { id: productId } });
    if (!products) {
      createError('invaild product', 400);
    }

    const productStock = await ProductStock.findOne({
      where: { id: products.dataValues.stockId },
    });

    let newProductUnitprice;
    let discounts;
    if (products.dataValues.discountsId === null) {
      newProductUnitprice = products.dataValues.productUnitprice;
    } else {
      discounts = await Discounts.findOne({
        where: { id: products.dataValues.discountsId },
      });
      newProductUnitprice =
        products.dataValues.productUnitprice -
        Math.floor(
          (products.dataValues.productUnitprice *
            discounts.dataValues.discounts) /
            100
        );
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

      if (productStock.dataValues.inventory - addAmount < 0) {
        createError('product is out of stock', 400);
      }

      addProductTotalPrice = newProductUnitprice * addAmount;
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
      const productTotalPrice = newProductUnitprice * amount;
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

exports.getCartByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const carts = await sequelize.query(
      `select c.id cartId, c.customer_id customerId, c.product_id productId, c.amount amount, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, p.product_name productName, p.product_unitprice productUnitPrice, pi.image1 image, p.seller_id sellerId, s.shop_name shopName, ps.id stockId, ps.inventory inventory, c.created_at createdAt, dis.id discountsId, dis.discounts discounts from ((((cart c join product_item p on c.product_id = p.id) left join product_images pi on p.images_id = pi.id) left join product_stock ps on p.stock_id = ps.id) left join seller s on p.seller_id = s.id) left join discounts dis on p.discounts_id = dis.id  where c.customer_id = ${customerId} `,
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

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const newCartIds = cartIds.split(',');

    const cartSelect = [];

    for (let item of newCartIds) {
      const cart = await sequelize.query(
        `select c.id cartId, c.customer_id customerId, c.product_id productId, c.seller_id sellerId, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, s.shop_name shopName, c.created_at createdAt, sa.id sellerAddressId, sa.district sellerDistrict, sa.province sellerProvince, sa.postcode sellerPostcode from (cart c left join seller s on c.seller_id = s.id) left join seller_address sa on s.id = sa.seller_id  where c.customer_id = ${customerId} and c.id = ${item}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      cartSelect.push(cart[0]);
    }

    const productTotalPrice = cartSelect.map((item) => item.productTotalPrice);

    const cartSellerId = cartSelect.map((item) => item.sellerId);
    const resultCartSellerId = [...new Set(cartSellerId)];

    const cartBySeller = [];
    for (let item of resultCartSellerId) {
      const seller = await sequelize.query(
        `select s.id sellerId, s.shop_name shopName, s.phone_number phoneNumber, s.shop_picture shopPicture, sa.id sellerAddressId, sa.district sellerDistrict, sa.province sellerProvince, sa.postcode sellerPostcode  from seller s left join seller_address sa on s.id = sa.seller_id where s.id = ${item}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      cartBySeller.push(seller[0]);
    }

    res.json({ cartBySeller, productTotalPrice });
  } catch (err) {
    next(err);
  }
};

exports.getCartProduct = async (req, res, next) => {
  try {
    const { sellerId, cartIds, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const newCartIds = cartIds.split(',');
    const cartProduct = [];
    for (let item of newCartIds) {
      const cart = await sequelize.query(
        `select c.id cartId, c.customer_id customerId, c.product_id productId, c.seller_id sellerId, c.amount amount, c.product_total_price productTotalPrice, c.product_weight_total productWeightTotal, p.product_name productName, p.product_unitprice productUnitPrice, pi.image1 image, ps.id stockId, ps.inventory inventory, c.created_at createdAt, dis.discounts discounts from (((cart c join product_item p on c.product_id = p.id) left join product_images pi on p.images_id = pi.id) left join product_stock ps on p.stock_id = ps.id) left join discounts dis on p.discounts_id = dis.id  where c.customer_id = ${customerId} and c.id = ${item} and c.seller_id = ${sellerId}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (cart[0]) {
        cartProduct.push(cart[0]);
      }
    }

    res.json({ cartProduct });
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

    const productItem = await ProductItem.findOne({
      where: { id: checkCartId.productId },
    });

    const productWeightTotal = productItem.productWeightPiece * amountCart;

    await Cart.update(
      {
        amount: amountCart,
        productTotalPrice: productTotalPriceCart,
        productWeightTotal: productWeightTotal,
      },
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
