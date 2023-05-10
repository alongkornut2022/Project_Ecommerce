module.exports = (sequelize, DataTypes) => {
  const PostcodeProvince = sequelize.define(
    'PostcodeProvince',
    {
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zoneGroup: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'postcode_province', underscored: true, timestamps: false }
  );

  PostcodeProvince.associate = (models) => {
    PostcodeProvince.belongsTo(models.PostcodeZone, {
      foreignKey: {
        allowNull: false,
        name: 'zoneId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return PostcodeProvince;
};
