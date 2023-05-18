module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productTotalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productWeightTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    { tableName: 'cart', underscored: true, timestamps: true }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.ProductItem, {
      foreignKey: {
        allowNull: false,
        name: 'productId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Cart.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Cart.belongsTo(models.Seller, {
      foreignKey: {
        allowNull: false,
        name: 'sellerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    // Cart.hasOne(models.OrderItem, {
    //   foreignKey: {
    //     allowNull: false,
    //     name: 'cartId',
    //   },
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // });
  };

  return Cart;
};
