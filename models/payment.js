module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      allTotalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'payment', underscored: true, timestamps: true }
  );

  Payment.associate = (models) => {
    Payment.hasOne(models.OrderDetail, {
      foreignKey: {
        allowNull: true,
        name: 'paymentId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Payment;
};
