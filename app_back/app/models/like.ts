import {Sequelize,DataTypes,Model,Models} from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize,DataTypes:DataTypes) => {
  const Like = sequelize.define('like', {
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
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'likes',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });

  Like.associate = function(this: Model<any,any>,models:Models) {
    // 食谱
    this.belongsTo( models['product'] ,{
      foreignKey : 'pid',
      as : 'like_product'
    });

    // 评论
    this.belongsTo( models['user'],{
      foreignKey : 'uid',
      as : 'like_user'
    });
  };
  return Like;
};