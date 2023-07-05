module.exports = (sequelize, DataTypes) => {
  const ThaiProvinces = sequelize.define(
    'ThaiProvinces',
    {
      nameTh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geographyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'thai_provinces', underscored: true, timestamps: true }
  );

  return ThaiProvinces;
};
