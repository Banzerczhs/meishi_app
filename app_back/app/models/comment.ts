import { Sequelize, DataTypes, Models, Model } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize, DataTypes: DataTypes) => {
  const Comment = sequelize.define('comment', {
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
    content : {
      type : DataTypes.TEXT,
      allowNull : false
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
    tableName: 'comments',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  Comment.associate = function(this: Model<any, any>, models: Models) {
    // associations can be defined here

    // 所属用户
    this.belongsTo(models['user'],{
      foreignKey : 'uid',
      as : 'comment_user'
    });

    // 所属食谱
    this.belongsTo(models['product'],{
      foreignKey : 'pid',
      as : 'comment_product'
    });
  };
  return Comment;
};