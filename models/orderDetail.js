module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    'OrderDetail',
    {
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productTotalPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cartIds: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'order_detail', underscored: true, timestamps: true }
  );

  OrderDetail.associate = (models) => {
    OrderDetail.hasMany(models.OrderItem, {
      foreignKey: {
        allowNull: false,
        name: 'orderDetailId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderDetail.belongsTo(models.Seller, {
      foreignKey: {
        allowNull: false,
        name: 'sellerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderDetail.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderDetail.belongsTo(models.CustomerAddress, {
      foreignKey: {
        allowNull: false,
        name: 'customerAddressId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderDetail.belongsTo(models.Payment, {
      foreignKey: {
        allowNull: true,
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    OrderDetail.belongsTo(models.Delivery, {
      foreignKey: {
        allowNull: true,
        name: 'deliveryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return OrderDetail;
};
