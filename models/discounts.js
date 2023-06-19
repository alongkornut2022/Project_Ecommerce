module.exports = (sequelize, DataTypes) => {
  const Discounts = sequelize.define(
    'Discounts',
    {
      discounts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'discounts', underscored: true, timestamps: true }
  );

  Discounts.associate = (models) => {
    Discounts.hasOne(models.ProductItem, {
      foreignKey: {
        allowNull: true,
        name: 'discountsId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    });
  };

  return Discounts;
};
