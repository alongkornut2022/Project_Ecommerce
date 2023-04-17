module.exports = (sequelize, Datatypes) => {
  const PostReview = sequelize.define(
    'PostReview',
    {
      title: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'post_review', underscored: true, timestamps: true }
  );

  PostReview.associate = (models) => {
    PostReview.belongsTo(models.PostImages, {
      foreignKey: {
        allowNull: true,
        name: 'postImagesId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    PostReview.belongsTo(models.Comment, {
      foreignKey: {
        allowNull: true,
        name: 'commentId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return PostReview;
};
