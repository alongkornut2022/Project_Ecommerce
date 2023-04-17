module.exports = (sequelize, Datatypes) => {
  const ProductStock = sequelize.define(
    'ProductStock',
    {
      stockStart: {
        type: Datatypes.INTEGER,
        allowNull: false,
      },
      alreadysold: {
        type: Datatypes.INTEGER,
        allowNull: false,
        defaultValue: '0',
      },
      inventory: {
        type: Datatypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'product_stock', underscored: true, timestamps: true }
  );

  ProductStock.associate = (models) => {
    ProductStock.hasOne(models.ProductItem, {
      foreignKey: {
        allowNull: true,
        name: 'stockId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductStock;
};
