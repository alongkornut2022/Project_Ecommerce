module.exports = (sequelize, Datatypes) => {
  const ProductReview = sequelize.define(
    'ProductReview',
    {
      ratingScale: {
        type: Datatypes.INTEGER,
        allowNull: true,
      },
      commentDetail: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'product_review', underscored: true, timestamps: true }
  );

  ProductReview.associate = (models) => {
    ProductReview.belongsTo(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductReview.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductReview;
};
