const { QueryTypes } = require('sequelize');
const { OrderDetail, Delivery, sequelize } = require('../models');
const createError = require('../utils/createError');

exports.getOrderDetail = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.query;

    if (!req.seller) {
      createError('you is not seller', 400);
    }

    if (req.seller.id != sellerId) {
      createError('invaild seller', 400);
    }

    if (status === 'ทั้งหมด') {
      const orderSeller = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, pay.image paymentImage, c.username customerName, de.delivery_option deliveryOption, de.delivery_price deliveryPrice,  ca.first_name fNameCustomer, ca.last_name lNameCustomer, ca.address_detail addressCustomer, ca.district districtCustomer, ca.province provinceCustomer, ca.postcode postcodeCustomer, ca.phone_number phoneNumberCustomer, sl.shop_name shopName, od.created_at createdAt from ((((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join customer c on od.customer_id = c.id) left join customer_address ca on od.customer_address_id = ca.id) left join seller sl on od.seller_id = sl.id  where od.seller_id = ${sellerId} order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderSeller });
    } else if (status === 'รอชำระเงิน') {
      const orderSeller = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, pay.image paymentImage, c.username customerName, de.delivery_option deliveryOption, de.delivery_price deliveryPrice, ca.first_name fNameCustomer, ca.last_name lNameCustomer, ca.address_detail addressCustomer, ca.district districtCustomer, ca.province provinceCustomer, ca.postcode postcodeCustomer, ca.phone_number phoneNumberCustomer, sl.shop_name shopName, od.created_at createdAt from ((((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join customer c on od.customer_id = c.id) left join customer_address ca on od.customer_address_id = ca.id) left join seller sl on od.seller_id = sl.id where od.seller_id = ${sellerId} and (od.status = 'รอชำระเงิน' or od.status = 'รออนุมัติ') order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderSeller });
    } else if (status === 'ชำระเงินแล้ว') {
      const orderSeller = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, pay.image paymentImage, c.username customerName, de.delivery_option deliveryOption, de.delivery_price deliveryPrice,  ca.first_name fNameCustomer, ca.last_name lNameCustomer, ca.address_detail addressCustomer, ca.district districtCustomer, ca.province provinceCustomer, ca.postcode postcodeCustomer, ca.phone_number phoneNumberCustomer, sl.shop_name shopName, od.created_at createdAt from ((((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join customer c on od.customer_id = c.id) left join customer_address ca on od.customer_address_id = ca.id) left join seller sl on od.seller_id = sl.id where od.seller_id = ${sellerId} and (od.status = 'ชำระเงินแล้ว' or od.status = 'อนุมัติแล้ว') order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderSeller });
    } else {
      const orderSeller = await sequelize.query(
        `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, pay.image paymentImage, c.username customerName, de.delivery_option deliveryOption, de.delivery_price deliveryPrice, ca.first_name fNameCustomer, ca.last_name lNameCustomer, ca.address_detail addressCustomer, ca.district districtCustomer, ca.province provinceCustomer, ca.postcode postcodeCustomer,ca.phone_number phoneNumberCustomer, od.created_at createdAt from (((order_detail od left join delivery de on od.delivery_id = de.id) left join payment pay on od.payment_id = pay.id) left join customer c on od.customer_id = c.id) left join customer_address ca on od.customer_address_id = ca.id where od.seller_id = ${sellerId} and od.status = '${status}' order by od.created_at desc;`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.json({ orderSeller });
    }
  } catch (err) {
    next(err);
  }
};

exports.getOrderItem = async (req, res, next) => {
  try {
    const { orderDetailId, sellerId } = req.params;

    if (!req.seller) {
      createError('you is not seller', 400);
    }

    if (req.seller.id != sellerId) {
      createError('invaild customer', 400);
    }

    const orderItem = await sequelize.query(
      `select oi.id orderItemId, oi.order_detail_id orderDetailId, oi.product_id productId, pi.product_name productName, pi.product_unitprice productUnitPrice, oi.amount amount, pim.image1 image, oi.product_unit_price productUnitPrice, oi.discounts discounts, oi.product_item_total_price productItemTotalPrice, oi.customer_id customerId, c.username username, c.user_picture userPicture, oi.created_at createdAt  from ((order_item oi left join product_item pi on oi.product_id = pi.id) left join product_images pim on pi.images_id = pim.id) left join customer c on oi.customer_id = c.id where oi.order_detail_id = ${orderDetailId};`,
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
    const { sellerId } = req.params;
    const {
      navBar,
      orderNumber,
      productName,
      customer,
      orderDateStart,
      orderDateTo,
      orderSumPriceStart,
      orderSumPriceTo,
      sort,
    } = req.query;

    if (!req.seller) {
      createError('is not seller', 400);
    }

    if (req.seller.id != sellerId) {
      createError('invaild seller', 400);
    }

    let opNavBar;
    let opOrderNumber;
    let opProductName;
    let opCustomer;
    let opOrderDate;
    let opOrderSumPrice;
    let opSort;

    if (navBar === 'ทั้งหมด') {
      opNavBar = ' ';
    } else if (navBar === 'รอชำระเงิน') {
      opNavBar = ` and (od.status = 'รอชำระเงิน' or od.status = 'รออนุมัติ') `;
    } else if (navBar === 'ชำระเงินแล้ว') {
      opNavBar = ` and (od.status = 'ชำระเงินแล้ว' or od.status = 'อนุมัติแล้ว') `;
    } else {
      opNavBar = ` and od.status = '${navBar}' `;
    }

    if (orderNumber === '') {
      opOrderNumber = ' ';
    } else {
      opOrderNumber = ` and od.id like '%${orderNumber}%' `;
    }

    if (productName === '') {
      opProductName = ' ';
    } else {
      opProductName = ` and pi.product_name like '%${productName}%' `;
    }

    if (customer === '') {
      opCustomer = ' ';
    } else {
      opCustomer = ` and cus.username like '%${customer}%' `;
    }

    if (orderDateStart === '' && orderDateTo === '') {
      opOrderDate = ' ';
    } else if (orderDateStart != '' && orderDateTo === '') {
      opOrderDate = ` and od.created_at like '%${orderDateStart}%' `;
    } else if (orderDateStart === '' && orderDateTo != '') {
      opOrderDate = `and od.created_at like '%${orderDateTo}%' `;
    } else if (orderDateStart != '' && orderDateTo != '') {
      opOrderDate = ` and od.created_at between '${orderDateStart}' and '${orderDateTo}' `;
    }

    if (orderSumPriceStart === '' && orderSumPriceTo === '') {
      opOrderSumPrice = ' ';
    } else if (orderSumPriceStart != '' && orderSumPriceTo === '') {
      opOrderSumPrice = ` and od.product_total_price = ${orderSumPriceStart} `;
    } else if (orderSumPriceStart === '' && orderSumPriceTo != '') {
      opOrderSumPrice = ` and od.product_total_price =  ${orderSumPriceTo} `;
    } else if (orderSumPriceStart != '' && orderSumPriceTo != '') {
      opOrderSumPrice = ` and od.product_total_price between ${orderSumPriceStart} and ${orderSumPriceTo} `;
    }

    if (sort === '') {
      opSort = ' ';
    } else if (sort === 'od.product_total_price desc') {
      opSort = 'order by od.product_total_price desc';
    } else if (sort === 'od.product_total_price') {
      opSort = 'order by od.product_total_price';
    } else if (sort === 'od.created_at desc') {
      opSort = 'order by od.created_at desc';
    } else if (sort === 'od.created_at') {
      opSort = 'order by od.created_at';
    }

    const orderSeller = await sequelize.query(
      `select od.id orderDetailId, od.seller_id sellerId, od.customer_id customerId, od.customer_address_id customerAddressId, od.delivery_id deliveryId, od.payment_id paymentId, od.product_total_price productTotalPrice, od.status status, pay.payment_method paymentMethod, pay.all_total_price allTotalPrice, pay.image paymentImage,  cus.username customerName, de.delivery_option deliveryOption, de.delivery_price deliveryPrice,  ca.first_name fNameCustomer, ca.last_name lNameCustomer, ca.address_detail addressCustomer, ca.district districtCustomer, ca.province provinceCustomer, ca.postcode postcodeCustomer, ca.phone_number phoneNumberCustomer, sl.shop_name shopName, od.created_at createdAt  from (((((((order_detail od left join order_item oi on od.id = oi.order_detail_id) left join product_item pi on oi.product_id = pi.id) left join seller sl on pi.seller_id = sl.id) left join customer cus on od.customer_id = cus.id)     left join delivery de on od.delivery_id = de.id)   left join payment pay on od.payment_id = pay.id)   left join customer_address ca on od.customer_address_id = ca.id)  where od.seller_id = ${sellerId}  ${opNavBar}  ${opOrderNumber}  ${opProductName}  ${opCustomer}  ${opOrderDate}  ${opOrderSumPrice} group by od.id  ${opSort}  ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({ orderSeller: orderSeller });
  } catch (err) {
    next(err);
  }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const { sellerId, deliveryId, orderDetailId } = req.params;

    if (!req.seller) {
      createError('is not seller', 400);
    }

    if (req.seller.id != sellerId) {
      createError('invaild seller', 400);
    }

    await Delivery.update(
      { status: 'อยู่ระหว่างจัดส่ง' },
      { where: { id: deliveryId } }
    );
    await OrderDetail.update(
      { status: 'อยู่ระหว่างจัดส่ง' },
      { where: { id: orderDetailId } }
    );

    res.json({ message: 'update success' });
  } catch (err) {
    next(err);
  }
};
