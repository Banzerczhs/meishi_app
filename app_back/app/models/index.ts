'use strict';

// const fs = require('fs');
import * as fs from 'fs';
// const path = require('path');
import * as path from 'path';
// const Sequelize = require('sequelize');
import * as Sequelize from 'sequelize';

// ts默认不能把json文件作为模块去处理（加载），写一个声明文件
import configs = require("../config/config.json");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

let config: IConf = configs;
config = config[env];
let db: IDB = {};

function testDatabasecon(db:Sequelize.Sequelize){
  db.authenticate()
  .then(()=>{
    console.log('Connection successfully');
  })
  .catch(()=>{
    console.log('Database connection fail')
  })
}

// 根据配置文件 configs 创建数据库实例
let sequelize: Sequelize.Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize.Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}

testDatabasecon(sequelize);

// 通过fs模块自动过去加载模型文件所在的目录下的所有的模型文件，比如user.ts，user-profile.ts
fs
  .readdirSync(__dirname)
  .filter((file) => {
    // basename => index.js
    // 对加载的文件进行过滤，过滤出来除了index.ts，已 .js 结尾的（编译后要加载的）
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    // 通过上面的过滤，找出来了所有的模型文件，调用sequelize['import']加载并实例化
    const model = sequelize['import'](path.join(__dirname, file));
    // 把实例化每一个模型对象保存到一个db对象下，这个对象的结构如下
    /**
      db = {
        user: new User(),
        'user-profile': new UserProfile()
        ....
      }
     */
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


export default db;