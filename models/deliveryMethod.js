module.exports = (sequelize, DataTypes) => {
  const DeliveryMethod = sequelize.define(
    'DeliveryMethod',
    {
      deliveryMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'delivery_method', underscored: true, timestamps: false }
  );

  DeliveryMethod.associate = (models) => {
    DeliveryMethod.hasOne(models.OrderTotal, {
      foreignKey: {
        allowNull: false,
        name: 'deliveryMethodId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return DeliveryMethod;
};
