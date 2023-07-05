module.exports = (sequelize, DataTypes) => {
  const ThaiAmphures = sequelize.define(
    'ThaiAmphures',
    {
      nameTh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'thai_amphures', underscored: true, timestamps: true }
  );

  return ThaiAmphures;
};
