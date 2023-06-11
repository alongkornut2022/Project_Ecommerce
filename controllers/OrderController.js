const { QueryTypes, Op } = require('sequelize');
const {
  Cart,
  OrderItem,
  OrderDetail,
  Delivery,
  Payment,
  sequelize,
} = require('../models');
const createError = require('../utils/createError');

exports.createOrder = async (req, res, next) => {
  try {
    const { cartIds, sellerIds, customerId } = req.params;
    const { paymentMethod, customerAddressId } = req.body;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    // if (paymentMethod && customerAddressId && sellerIds && cartIds) {
    //   createError('invaild Data', 400);
    // }

    const newCartIds = cartIds.split(',');
    const newSellerIds = sellerIds.split(',');

    let orderDetails;
    let order;
    for (let itemSeller of newSellerIds) {
      orderDetails = await OrderDetail.create({
        sellerId: itemSeller,
        customerId: customerId,
        customerAddressId: customerAddressId,
      });

      let productTotalPrice = 0;
      let cartBySeller = [];
      let orderItems = [];
      for (let itemId of newCartIds) {
        const cartItem = await Cart.findOne({
          where: { id: itemId, sellerId: itemSeller },
        });

        if (cartItem) {
          orderItems = await OrderItem.create({
            cartId: cartItem.dataValues.id,
            orderDetailId: orderDetails.dataValues.id,
            productId: cartItem.dataValues.productId,
            customerId: customerId,
            amount: cartItem.dataValues.amount,
            productItemTotalPrice: cartItem.dataValues.productTotalPrice,
            productWeightTotal: cartItem.dataValues.productWeightTotal,
          });
          productTotalPrice =
            productTotalPrice + cartItem.dataValues.productTotalPrice;
          cartBySeller.push(cartItem.dataValues.id);
        }
      }

      const cartBySellerStr = cartBySeller.join(',');

      const deliveryItem = await Delivery.findOne({
        where: { cartIds: cartBySellerStr },
      });

      const allTotalPrice =
        productTotalPrice + deliveryItem.dataValues.deliveryPrice;

      let status = '';
      if (paymentMethod === 'ชำระเงินปลายทาง') {
        status = 'รออนุมัติ';
      } else if (
        paymentMethod === 'Mobile Banking' ||
        paymentMethod === 'Credit Card'
      ) {
        status = 'รอชำระเงิน';
      }

      const payments = await Payment.create({
        paymentMethod: paymentMethod,
        allTotalPrice: allTotalPrice,
        status: status,
      });

      order = await OrderDetail.update(
        {
          productTotalPrice: productTotalPrice,
          cartIds: cartBySellerStr,
          deliveryId: deliveryItem.dataValues.id,
          paymentId: payments.dataValues.id,
          status: status,
        },
        { where: { id: orderDetails.dataValues.id } }
      );
    }

    for (let item of newCartIds) {
      await Cart.destroy({ where: { id: item, customerId: customerId } });
    }

    res.json({ message: 'create success' });
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    if (status === 'ทั้งหมด') {
      const orderCustomer = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, s.shop_name shopName, de.delivery_price deliveryPrice, od.created_at createdAt from ((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join seller s on od.seller_id = s.id where od.customer_id = ${customerId} order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderCustomer });
    } else if (status === 'รอชำระเงิน') {
      const orderCustomer = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, s.shop_name shopName, de.delivery_price deliveryPrice, od.created_at createdAt from ((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join seller s on od.seller_id = s.id where od.customer_id = ${customerId} and (od.status = 'รอชำระเงิน' or od.status = 'รออนุมัติ') order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderCustomer });
    } else {
      const orderCustomer = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, s.shop_name shopName, de.delivery_price deliveryPrice, od.created_at createdAt from ((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join seller s on od.seller_id = s.id where od.customer_id = ${customerId} and od.status = '${status}' order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderCustomer });
    }
  } catch (err) {
    next(err);
  }
};

exports.getOrderItem = async (req, res, next) => {
  try {
    const { orderDetailId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const orderItem = await sequelize.query(
      // `select oi.id orderItemId, oi.order_detail_id orderDetailId, oi.product_id productId, pi.product_name productName, pim.image1 image, oi.product_item_total_price productItemTotalPrice from (order_item oi left join product_item pi on oi.product_id = pi.id) left join product_images pim on pi.images_id = pim.id where oi.order_detail_id = ${orderDetailId};`,
      `select oi.id orderItemId, oi.order_detail_id orderDetailId, oi.product_id productId, pi.product_name productName, pi.product_unitprice productUnitPrice, oi.amount amount, pim.image1 image, oi.product_item_total_price productItemTotalPrice, oi.customer_id customerId, c.username username, c.user_picture userPicture, oi.created_at createdAt  from ((order_item oi left join product_item pi on oi.product_id = pi.id) left join product_images pim on pi.images_id = pim.id) left join customer c on oi.customer_id = c.id where oi.order_detail_id = ${orderDetailId};`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ orderItem });
  } catch (err) {
    next(err);
  }
};

exports.getSearchOrder = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { keyword } = req.query;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    let orderCustomer2 = [];
    let orderCustomer1 = await sequelize.query(
      `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, s.shop_name shopName, od.created_at createdAt from ((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join seller s on od.seller_id = s.id where od.customer_id = ${customerId} and od.id = '${keyword}' or s.shop_name like '%${keyword}%' order by od.created_at desc;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (orderCustomer1.length > 0) {
      res.json({ orderCustomer: orderCustomer1 });
    }

    const orderItem = await sequelize.query(
      `select oi.id orderItemId, oi.order_detail_id orderDetailId, oi.customer_id customerId, oi.product_id productId, pi.product_name productName from order_item oi left join product_item pi on oi.product_id = pi.id where oi.customer_id = ${customerId} and pi.product_name like '%${keyword}%';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (orderItem) {
      const newOrderItem = orderItem.map((item) => item.orderDetailId);
      const orderItemIds = [...new Set(newOrderItem)];
      for (let item of orderItemIds) {
        let orderDatailItem = await sequelize.query(
          `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, s.shop_name shopName, od.created_at createdAt from ((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join seller s on od.seller_id = s.id where od.customer_id = ${customerId} and od.id = ${item};`,
          {
            type: QueryTypes.SELECT,
          }
        );

        orderCustomer2.push(orderDatailItem[0]);
      }
      res.json({ orderCustomer: orderCustomer2 });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.deleteOrderById = async (req, res, next) => {
  try {
    const { orderDetailId, customerId } = req.params;

    if (req.customer.id != customerId) {
      createError('invaild customer', 400);
    }

    const orderItem = await OrderItem.findAll({
      where: { orderDetailId: orderDetailId },
    });

    const orderItemId = orderItem.map((item) => item.id);
    for (let item of orderItemId) {
      await OrderItem.destroy({ where: { id: item } });
    }

    const orderDetail = await OrderDetail.findOne({
      where: { id: orderDetailId },
    });

    await OrderDetail.destroy({ where: { id: orderDetailId } });
    await Delivery.destroy({ where: { id: orderDetail.deliveryId } });
    await Payment.destroy({ where: { id: orderDetail.paymentId } });

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};