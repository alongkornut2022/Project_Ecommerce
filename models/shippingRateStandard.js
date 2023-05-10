module.exports = (sequelize, DataTypes) => {
  const ShippingRatesStandard = sequelize.define(
    'ShippingRatesStandard',
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
      tableName: 'shipping_rates_standard',
      underscored: true,
      timestamps: false,
    }
  );

  return ShippingRatesStandard;
};
