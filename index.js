const db = require('./models');

db.sequelize
  .authenticate()
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err.message));
