'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.changeColumn('users','password',{
     type : Sequelize.CHAR(32),
     allowNull : false,
     defaultValue : '12345'
   }).then(()=>{
      return queryInterface.changeColumn('users','phone',{
        type : Sequelize.CHAR(11),
        allowNull : true,
        defaultValue : '————'
      })
   });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return new Promise((res,rej)=>{
      res('ok');
    })
  }
};
