'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('products',{
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
      cid : {
        type : Sequelize.INTEGER(10).UNSIGNED,
        allowNull : false,
        references : {
          model : 'categorys',
          key : 'id'
        }
      },
      name : {
        type : Sequelize.STRING(15),
        allowNull : true
      },
      desc : {
        type : Sequelize.TEXT,
        allowNull : true
      },
      isSole : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false,
        comment : '是否为独家产品'
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
      modelName : 'products',
      paranoid : true,
      timestamps : true,
      deletedAt : 'destroyTime'
    }).then(()=>{
      queryInterface.addIndex('products',{
        fields : ['isSole']
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
    return queryInterface.dropTable('products');
  }
};
