import {Sequelize,DataTypes,Model,Models} from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize,DataTypes:DataTypes) => {
  const Ingredient = sequelize.define('ingredient', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mainstuff: {
      type: DataTypes.STRING(1000),
      allowNull : true
    },
    secondstuff: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    rest: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'ingredients',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });

  Ingredient.associate = function(this: Model<any,any>,models:Models) {
    // 食谱
    this.belongsTo( models['product'] ,{
      foreignKey : 'pid',
      as : 'ingredient_product'
    });
  };
  return Ingredient;
};