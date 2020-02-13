import { Sequelize, DataTypes, Model, Models } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize, DataTypes: DataTypes) => {
  const Step = sequelize.define('step', {
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
    content : {
      type : DataTypes.STRING(1000),
      allowNull : false
    },
    pic : {
      type : DataTypes.STRING(5000),
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
    tableName: 'steps',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  Step.associate = function(this: Model<any, any>,models:Models) {
    // associations can be defined here

    // 所属食谱
    this.belongsTo( models['product'], {
      foreignKey: 'pid',
      as : 'step_product'
    } );
  };
  return Step;
};