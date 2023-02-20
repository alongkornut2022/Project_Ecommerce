require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const customerRoute = require('./routes/customerRoute');
const productRoute = require('./routes/productRoute');
const notFoundMiddleware = require('./middlewares/notFound');
const errormiddleware = require('./middlewares/error');

const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', customerRoute);
app.use('/products', productRoute);

app.use(notFoundMiddleware);
app.use(errormiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port: ${port}`));
