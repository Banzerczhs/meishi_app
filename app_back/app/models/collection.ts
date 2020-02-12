import { Sequelize, DataTypes, Models, Model } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize, DataTypes: DataTypes) => {
  const Collection = sequelize.define('collection', {
    id : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      autoIncrement : true,
      primaryKey : true
    },
    pid : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      references : {
        model : 'product',
        key : 'id'
      }
    },
    uid : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      references : {
        model : 'user',
        key : 'id'
      }
    },
    createdAt : {
      type : DataTypes.DATE,
      allowNull : true
    },
    updatedAt : {
      type : DataTypes.DATE,
      allowNull : true
    }
  }, {
    tableName: 'collections',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  Collection.associate = function(this: Model<any, any>, models: Models) {
    // associations can be defined here

    // 所属用户
    this.belongsTo( models['user'], {
      foreignKey: 'uid',
      as : 'collection_user'
    } );

    // 所属食品
    this.belongsTo( models['product'], {
      foreignKey: 'pid',
      as : 'collection_product'
    } );
  };
  return Collection;
};