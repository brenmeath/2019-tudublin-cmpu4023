'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('users', [{
        id: '51',
        email: 'someone@somewhere.com',
        created_at: new Date(),
        password: '511e3229996147ae68f83bab75b9733e'
        
      },{
        id: '52',
        email: 'rm4321@max.com',
        created_at: new Date(),
        password: '511e3229996147ae68f83bab75b9733e'
        
      },{
        id: '53',
        email: 'user32@what.mail',
        created_at: new Date(),
        password: '511e3229996147ae68f83bab75b9733e'
        
      },{
        id: '54',
        email: 'yellow@red.blue',
        created_at: new Date(),
        password: '511e3229996147ae68f83bab75b9733e'
        
      }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('users', {id: {[Op.in]: [51, 52, 53, 54]}}, {});
  }
};
