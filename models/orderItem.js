module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      amountProduct: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalProductPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'order_item', underscored: true, timestamps: true }
  );

  // OrderItem.associate = (models) => {
  //   OrderItem.hasMany(models.Cart, {
  //     foreignKey: {
  //       allowNull: true,
  //       name: 'orderItemId',
  //     },
  //     onDelete: 'RESTRICT',
  //     onUpdate: 'RESTRICT',
  //   });
  // };

  return OrderItem;
};
