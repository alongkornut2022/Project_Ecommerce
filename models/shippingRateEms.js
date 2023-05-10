module.exports = (sequelize, DataTypes) => {
  const ShippingRatesEms = sequelize.define(
    'ShippingRatesEms',
    {
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      areaG1: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      areaG2: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      areaG3: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'shipping_rates_ems',
      underscored: true,
      timestamps: false,
    }
  );

  return ShippingRatesEms;
};
