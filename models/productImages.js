module.exports = (sequelize, Datatypes) => {
  const ProductImages = sequelize.define(
    'ProductImages',
    {
      image1: {
        type: Datatypes.STRING,
        allowNull: false,
      },
      image2: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image3: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image4: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image5: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image6: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image7: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image8: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image9: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'product_images', underscored: true, timestamps: false }
  );

  ProductImages.associate = (models) => {
    ProductImages.hasOne(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'imagesId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductImages;
};
