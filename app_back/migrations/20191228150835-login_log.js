'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('login_logs',{
      id : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
      },
      uid : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        references : {
          model : 'users',
          key : 'id'
        }
      },
      login_ip : {
        type : Sequelize.STRING(15),
        allowNull : false,
        defaultValue: ''
      },
      loginout_ip : {
        type: Sequelize.CHAR(15),
        allowNull: false,
        defaultValue: ''
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
      modelName : 'login_logs',
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
    return queryInterface.dropTable('login_logs');
  }
};
