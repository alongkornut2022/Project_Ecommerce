module.exports = (sequelize, DataTypes) => {
  const ThaiGeographies = sequelize.define(
    'ThaiGeographies',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'thai_geographies', underscored: true, timestamps: true }
  );

  return ThaiGeographies;
};
