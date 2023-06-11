module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define(
    'Delivery',
    {
      deliveryOption: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartIds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'delivery', underscored: true, timestamps: true }
  );

  Delivery.associate = (models) => {
    Delivery.hasOne(models.OrderDetail, {
      foreignKey: {
        allowNull: true,
        name: 'deliveryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Delivery.belongsTo(models.Seller, {
      foreignKey: {
        allowNull: false,
        name: 'sellerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Delivery;
};
