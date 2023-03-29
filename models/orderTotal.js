module.exports = (sequelize, DataTypes) => {
  const OrderTotal = sequelize.define(
    'OrderTotal',
    {
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'order_total', underscored: true, timestamps: true }
  );

  OrderTotal.associate = (models) => {
    OrderTotal.belongsTo(models.OrderItem, {
      foreignKey: {
        allowNull: false,
        name: 'orderItemId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderTotal.belongsTo(models.CustomerAddress, {
      foreignKey: {
        allowNull: false,
        name: 'customerAddressId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderTotal.belongsTo(models.DeliveryMethod, {
      foreignKey: {
        allowNull: false,
        name: 'deliveryMethodId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderTotal.belongsTo(models.PaymentMethod, {
      foreignKey: {
        allowNull: false,
        name: 'paymentMethodId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderTotal;
};
