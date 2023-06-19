require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const customerRoute = require('./routes/customerRoute');
const sellerProductRoute = require('./routes/products/sellerProductRoute');
const productRoute = require('./routes/productRoute');
const sellerAuthRoute = require('./routes/sellerAuthRoute');
const sellerRoute = require('./routes/sellerRoute');
const addressRoute = require('./routes/addressRoute');
const cartRoute = require('./routes/cartRoute');
const PurchaseRoute = require('./routes/PurchaseRoute');
const DeliveryRoute = require('./routes/deliveryRoute');
const PostRoute = require('./routes/postRoute');
const carouselRoute = require('./routes/carouselRoute');
const sellerOrderRoute = require('./routes/sellerOrderRoute');

const notFoundMiddleware = require('./middlewares/notFound');
const errormiddleware = require('./middlewares/error');
const customerAuthenticate = require('./middlewares/customerAuthenticate');
const sellerAuthenticate = require('./middlewares/sellerAuthenticate');

const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/customers', authRoute);
app.use('/customers', customerAuthenticate, customerRoute);

app.use('/sellers', sellerAuthRoute);
app.use('/sellers', sellerAuthenticate, sellerRoute);
app.use('/sellers/products', sellerAuthenticate, sellerProductRoute);
app.use('/sellers/order', sellerAuthenticate, sellerOrderRoute);

app.use('/address', addressRoute);

app.use('/products', productRoute);
app.use('/carousel', carouselRoute);

app.use('/cart', customerAuthenticate, cartRoute);
app.use('/Purchase', customerAuthenticate, PurchaseRoute);
app.use('/delivery', customerAuthenticate, DeliveryRoute);
app.use('/postreview', PostRoute);

app.use(notFoundMiddleware);
app.use(errormiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port: ${port}`));
