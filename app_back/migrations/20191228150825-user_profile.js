'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('user_profiles',{
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
      uimg : {
        type : Sequelize.STRING(255),
        allowNull : true,
        comment : '用户头像'
      },
      gender : {
        type: Sequelize.ENUM(['男','女','保密']),
        allowNull : false,
        defaultValue : '保密'
      },
      profile : {
        type : Sequelize.TEXT,
        allowNull : true,
        comment : '个人简介'
      },
      isVip : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
      },
      birthday : {
        type : Sequelize.STRING(255),
        allowNull : true
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
      modelName : 'user_profiles',
      paranoid : true,
      timestamps : true,
      deletedAt : 'destroyTime',
    }).then(()=>{
      queryInterface.addIndex('user_profiles',{
        fields : ['gender','isVip']
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('user_profiles');
  }
};
