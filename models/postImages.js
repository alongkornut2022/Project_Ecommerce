module.exports = (sequelize, Datatypes) => {
  const PostImages = sequelize.define(
    'PostImages',
    {
      image1: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image2: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image3: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image4: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      image5: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'post_images', underscored: true, timestamps: false }
  );

  PostImages.associate = (models) => {
    PostImages.hasOne(models.PostReview, {
      foreignKey: {
        allowNull: true,
        name: 'postImagestId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return PostImages;
};
