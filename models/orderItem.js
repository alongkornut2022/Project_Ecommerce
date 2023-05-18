module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productItemTotalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productWeightTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'order_item', underscored: true, timestamps: true }
  );

  OrderItem.associate = (models) => {
    // OrderItem.belongsTo(models.Cart, {
    //   foreignKey: {
    //     allowNull: false,
    //     name: 'cartId',
    //   },
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // });

    OrderItem.belongsTo(models.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: 'orderDetailId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderItem.belongsTo(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderItem.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: true,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderItem;
};
