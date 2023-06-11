module.exports = (sequelize, Datatypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      comment: {
        type: Datatypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'comment', underscored: true, timestamps: true }
  );

  Comment.associate = (models) => {
    Comment.hasOne(models.ProductRating, {
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
