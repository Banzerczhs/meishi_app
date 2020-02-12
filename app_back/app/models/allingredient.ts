import {Sequelize,DataTypes,Model,Models} from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize,DataTypes:DataTypes) => {
  const Allingredient = sequelize.define('allingredient', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
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
    tableName: 'allingredients',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });

  Allingredient.associate = function(this: Model<any,any>,models:Models) {
    // associations can be defined here
    // 基本资料
    this.belongsTo( models['product'] ,{
      foreignKey : 'pid',
      as : 'allingred_product'
    });
  };
  return Allingredient;
};