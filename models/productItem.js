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

      productWeightPiece: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carouselStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productStatus: {
        type: DataTypes.STRING,
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

    ProductItem.belongsTo(models.ProductImages, {
      foreignKey: {
        allowNull: false,
        name: 'imagesId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.belongsTo(models.ProductStock, {
      foreignKey: {
        allowNull: false,
        name: 'stockId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.belongsTo(models.ProductSpec, {
      foreignKey: {
        allowNull: false,
        name: 'specId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.hasMany(models.ProductRating, {
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

    ProductItem.belongsTo(models.Seller, {
      foreignKey: {
        allowNull: false,
        name: 'sellerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.hasOne(models.OrderItem, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    ProductItem.belongsTo(models.Discounts, {
      foreignKey: {
        allowNull: true,
        name: 'discountsId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductItem;
};
