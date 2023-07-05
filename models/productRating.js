module.exports = (sequelize, Datatypes) => {
  const ProductRating = sequelize.define(
    'ProductRating',
    {
      rating: {
        type: Datatypes.INTEGER,
        allowNull: false,
      },
      postReview: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      displayUsername: {
        type: Datatypes.INTEGER,
        allowNull: false,
        default: 0,
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

    ProductRating.belongsTo(models.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: 'orderDetailId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductRating.belongsTo(models.PostImages, {
      foreignKey: {
        allowNull: true,
        name: 'postImagesId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    });

    ProductRating.belongsTo(models.Comment, {
      foreignKey: {
        allowNull: true,
        name: 'commentId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductRating;
};
