import { Sequelize, DataTypes, Models, Model } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize, DataTypes: DataTypes) => {
  const LoginLog = sequelize.define('login-log', {
    id : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      autoIncrement : true,
      primaryKey : true
    },
    uid : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      references : {
        model : 'user',
        key : 'id'
      }
    },
    login_ip : {
      type : DataTypes.STRING(15),
      allowNull : false,
      defaultValue: ''
    },
    loginout_ip : {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: ''
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
    tableName: 'login_logs',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  LoginLog.associate = function(this: Model<any, any>, models: Models) {
    // associations can be defined here
    
    this.belongsTo( models['user'], {
      foreignKey: 'uid',
      as : 'loginLog_user'
    });
  };
  return LoginLog;
};