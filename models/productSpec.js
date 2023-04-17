module.exports = (sequelize, Datatypes) => {
  const ProductSpec = sequelize.define(
    'ProductSpec',
    {
      productSpec: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'product_spec', underscored: true, timestamps: false }
  );

  ProductSpec.associate = (models) => {
    ProductSpec.hasOne(models.ProductItem, {
      foreignKey: {
        allowNull: true,
        name: 'specId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return ProductSpec;
};
