'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchase_items', [{
        id: '5001',
        purchase_id: 21,
        product_id: 20,
        price: 14.99,
        quantity: 1,
        state: 'Delivered'
        
      },{
        id: '5002',
        purchase_id: 21,
        product_id: 10,
        price: 529.00,
        quantity: 1,
        state: 'Returned'
        
      },{
        id: '5003',
        purchase_id: 21,
        product_id: 17,
        price: 14.99,
        quantity: 1,
        state: 'Delivered'
        
      },{
        id: '5004',
        purchase_id: 21,
        product_id: 15,
        price: 9.99,
        quantity: 1,
        state: 'Delivered'
        
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchase_items', {id: {[Op.in]: [5001, 5002, 5003, 5004]}}, {});
  }
};
