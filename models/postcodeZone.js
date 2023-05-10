module.exports = (sequelize, DataTypes) => {
  const PostcodeZone = sequelize.define(
    'PostcodeZone',
    {
      zone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'postcode_zone', underscored: true, timestamps: false }
  );

  PostcodeZone.associate = (models) => {
    PostcodeZone.hasMany(models.PostcodeProvince, {
      foreignKey: {
        allowNull: false,
        name: 'zoneId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return PostcodeZone;
};
