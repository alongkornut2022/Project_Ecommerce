module.exports = (sequelize, DataTypes) => {
  const ProductItem = sequelize.define(
    'ProductItem',
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productUnitprice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'product_item', underscored: true, timestamps: true }
  );

  ProductItem.associate = (models) => {
    ProductItem.belongsTo(models.ProductCategory, {
      foreignKey: {
        allowNull: false,
        name: 'categoryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.hasOne(models.ProductStock, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.hasMany(models.ProductReview, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.hasOne(models.Cart, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductItem;
};
