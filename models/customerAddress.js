module.exports = (sequelize, DataTypes) => {
  const CustomerAddress = sequelize.define(
    'CustomerAddress',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      addressDetail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      postcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'customer_address',
      underscored: true,
      timestamps: true,
    }
  );

  CustomerAddress.associate = (models) => {
    CustomerAddress.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
        name: 'customerId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    CustomerAddress.hasOne(models.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: 'customerAddressId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return CustomerAddress;
};
