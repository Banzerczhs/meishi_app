'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('comments',{
      id : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
      },
      pid : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        references : {
          model : 'products',
          key : 'id'
        }
      },
      uid : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        references : {
          model : 'users',
          key : 'id'
        }
      },
      content : {
        type : Sequelize.TEXT,
        allowNull : false
      },
      createdAt : {
        type : Sequelize.DATE,
        allowNull : true
      },
      updatedAt : {
        type : Sequelize.DATE,
        allowNull : true
      },
      destroyTime : {
        type : Sequelize.DATE,
        allowNull : true
      }
    },{
      charset : 'utf8mb4',
      collate : 'utf8mb4_bin',
      engine : 'InnoDB',
      modelName : 'comments',
      paranoid : true,
      timestamps : true,
      deletedAt : 'destroyTime'
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('comments');
  }
};
