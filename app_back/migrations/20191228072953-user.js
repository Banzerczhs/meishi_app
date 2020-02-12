'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('users',{
      id : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
      },
      username : {
        type : Sequelize.STRING(100),
        allowNull : false,
        unique : true
      },
      password : {
        type : Sequelize.STRING(18),
        allowNull : false
      },
      disable : {
        type : Sequelize.BOOLEAN,
        allowNull : true,
        defaultValue : false,
        comment : '用户是否禁用'
      },
      phone : {
        type : Sequelize.CHAR(11),
        allowNull : true,
        defaultValue : null
      },
      email : {
        type : Sequelize.STRING(40),
        allowNull : true,
        defaultValue : null
      },
      created_ip_at : {
        type : Sequelize.STRING(15),
        allowNull : true,
        defaultValue : null
      },
      updated_ip_at : {
        type : Sequelize.STRING(15),
        allowNull : true,
        defaultValue : null
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
      modelName : 'users',
      paranoid : true,
      timestamps : true,
      deletedAt : 'destroyTime'
    }).then(()=>{
      queryInterface.addIndex('users',{
        fields : ['disable','phone','email']
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

    return queryInterface.dropTable('users');
  }
};
