module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: DataTypes.ENUM('male', 'female', 'other'),
      birthDate: DataTypes.DATEONLY,
      userPicture: DataTypes.STRING,
    },
    { tableName: 'customer', underscored: true, timestamps: true }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.CustomerAddress, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Customer.hasOne(models.ProductRating, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Customer.hasMany(models.Cart, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Customer;
};
