'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('products', [{
        id: '21',
        title: 'DVD Player',
        price: '39.99',
        created_at: new Date()
      },{
        id: '22',
        title: 'Mountain Bike',
        price: '599.99',
        created_at: new Date()
      },{
        id: '23',
        title: 'Bucket',
        price: '4.99',
        created_at: new Date()
      },{
        id: '24',
        title: 'Mop',
        price: '9.99',
        created_at: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', {id: {[Op.in]: [21, 22, 23, 24]}}, {});
  }
};
