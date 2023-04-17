require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const customerRoute = require('./routes/customerRoute');
const sellerProductRoute = require('./routes/products/sellerProductRoute');
const categoryRoute = require('./routes/products/categoryRoute');
const stockRoute = require('./routes/products/stockRoute');
const productRoute = require('./routes/productRoute');
const sellerAuthRoute = require('./routes/sellerAuthRoute');
const sellerRoute = require('./routes/sellerRoute');
const addressRoute = require('./routes/addressRoute');
const PurchaseRoute = require('./routes/PurchaseRoute');

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

app.use('/address', addressRoute);

app.use('/products/', productRoute);

app.use('/Purchase', customerAuthenticate, PurchaseRoute);

app.use(notFoundMiddleware);
app.use(errormiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port: ${port}`));
