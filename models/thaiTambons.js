module.exports = (sequelize, DataTypes) => {
  const ThaiTambons = sequelize.define(
    'ThaiTambons',
    {
      zipCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nameTh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameEn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amphureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'thai_tambons', underscored: true, timestamps: true }
  );

  return ThaiTambons;
};
