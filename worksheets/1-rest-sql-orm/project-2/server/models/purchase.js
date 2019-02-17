'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Purchase.associate = function(models) {
    // associations can be defined here
    PurchaseItem.hasMany(models.User, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });
  };
  return Purchase;
};
