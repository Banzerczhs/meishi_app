import {Sequelize,DataTypes,Model,Models} from "sequelize";
import * as md5 from "md5";

'use strict';
module.exports = (sequelize: Sequelize,DataTypes:DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull : false,
      defaultValue: '12345',
      set(val: string) {
        this.setDataValue('password',md5(val));
      }
    },
    disable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phone: {
      type: DataTypes.CHAR(12),
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    identity: {
      type: DataTypes.ENUM('管理员','合作者','客户'),
      allowNull: false,
      defaultValue: '客户'
    },
    created_ip_at: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: ''
    },
    updated_ip_at: {
      type: DataTypes.CHAR(15),
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
    tableName: 'users',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      banzer: {
        limit: 1
      }
    }
  });

  User.associate = function(this: Model<any,any>,models:Models) {
    // associations can be defined here
    // 基本资料
    this.hasOne( models['user-profile'] ,{
      foreignKey : 'uid',
      as : 'user_profile'
    });

    // 登录日志
    this.hasMany( models['login-log'] ,{
      foreignKey : 'uid',
      as : 'user_loginLog'
    });

    // 我的收藏
    this.hasMany( models['collection'],{
      foreignKey : 'uid',
      as : 'user_collection'
    } );

    // 食谱
    this.hasMany( models['product'] ,{
      foreignKey : 'uid',
      as : 'user_product'
    });

    // 评论
    this.hasMany( models['comment'],{
      foreignKey : 'uid',
      as : 'user_comment'
    });
  };
  return User;
};