module.exports = (sequelize, DataTypes) => {
  const CarouselBanner = sequelize.define(
    'CarouselBanner',
    {
      carousel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'carousel_banner', underscored: true, timestamps: true }
  );

  return CarouselBanner;
};
