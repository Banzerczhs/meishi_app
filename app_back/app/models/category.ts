import { Sequelize, DataTypes, Models, Model } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize,DataTypes:DataTypes) => {
  const Category = sequelize.define('category', {
    id : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      autoIncrement : true,
      primaryKey : true
    },
    name : {
      type : DataTypes.STRING(15),
      allowNull : false
    },
    pid : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false
    },
    alias : {
      type : DataTypes.STRING(15),
      allowNull : true
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
    tableName: 'categorys',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  Category.associate = function(this: Model<any, any>, models: Models) {
    // associations can be defined here
    // 食品
    this.hasMany( models['product'],{
      foreignKey : 'cid',
      as : 'category_product'
    });
  };
  return Category;
};