'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('purchases', [{
        id: '1001',
        created_at: new Date(),
        name: 'Robert Murphy',
        address: '82 Green Lane',
        state: 'NY',
        zipcode: 12345,
        userid: 15
        
      },{
        id: '1002',
        created_at: new Date(),
        name: 'George Redmond',
        address: '1 Blue Street',
        state: 'TX',
        zipcode: 34564,
        userid: 11
        
      },{
        id: '1003',
        created_at: new Date(),
        name: 'Eoghan Simmons',
        address: '3 Orange Street',
        state: 'WA',
        zipcode: 78409,
        userid: 13
      },{
        id: '1004',
        created_at: new Date(),
        name: 'Aoife White',
        address: '4 Purple Street',
        state: 'TX',
        zipcode: 77877,
        userid: 19
        
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('purchases', {id: {[Op.in]: [1001, 1002, 1003, 1004]}}, {});
  }
};
