module.exports = (sequelize, Datatypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      categoryName: {
        type: Datatypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'product_category', underscored: true, timestamps: false }
  );

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'categoryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductCategory;
};
