'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.addIndex('categorys',{
      fields : ['name'],
      unique : true
    }).then(()=>{
      queryInterface.addIndex('categorys',{
        fields : ['alias'],
        unique : true
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.removeIndex('categorys','categorys_alias',{
      fields : ['alias']
    }).then(()=>{
      queryInterface.removeIndex('categorys','categorys_name',{
        fields : ['name']
      })
    })
  }
};
