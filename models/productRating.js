module.exports = (sequelize, Datatypes) => {
  const ProductRating = sequelize.define(
    'ProductRating',
    {
      ratingScale: {
        type: Datatypes.INTEGER,
        allowNull: true,
      },
    },
    { tableName: 'product_rating', underscored: true, timestamps: true }
  );

  ProductRating.associate = (models) => {
    ProductRating.belongsTo(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductRating.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductRating;
};
