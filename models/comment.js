module.exports = (sequelize, Datatypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      title: {
        type: Datatypes.STRING,
        allowNull: true,
      },
    },
    { tableName: 'comment', underscored: true, timestamps: true }
  );

  Comment.associate = (models) => {
    Comment.hasOne(models.PostReview, {
      foreignKey: {
        allowNull: true,
        name: 'commentId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Comment.belongsTo(models.Seller, {
      foreignKey: {
        allowNull: false,
        name: 'sellerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Comment;
};
