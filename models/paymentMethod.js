module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define(
    'PaymentMethod',
    {
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'payment_method', underscored: true, timestamps: false }
  );

  PaymentMethod.associate = (models) => {
    PaymentMethod.hasOne(models.OrderTotal, {
      foreignKey: {
        allowNull: false,
        name: 'paymentMethodId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return PaymentMethod;
};
