'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseItem = sequelize.define('PurchaseItem', {
    id: DataTypes.INTEGER,
    purchaseId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    state: DataTypes.STRING
  }, {});
  PurchaseItem.associate = function(models) {
    // associations can be defined here
    PurchaseItem.hasMany(models.Purchase, {
        foreignKey: {
            name: 'purchaseId',
            allowNull: false
        }
    });
    PurchaseItem.hasMany(models.Product, {
        foreignKey: {
            name: 'productId',
            allowNull: false
        }
    });
  };
  return PurchaseItem;
};
