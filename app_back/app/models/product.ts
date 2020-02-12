import { Sequelize, DataTypes, Models, Model } from "sequelize";

'use strict';
module.exports = (sequelize: Sequelize, DataTypes: DataTypes) => {
  const Product = sequelize.define('product', {
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
    cid : {
      type : DataTypes.INTEGER(10).UNSIGNED,
      allowNull : false,
      references : {
        model : 'category',
        key : 'id'
      }
    },
    cover : {
      type : Sequelize.STRING(1000),
      allowNull : true
    },
    name : {
      type : DataTypes.STRING(15),
      allowNull : true
    },
    desc : {
      type : DataTypes.TEXT,
      allowNull : true
    },
    isSole : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      comment : '是否为独家产品'
    },
    tips : {
      type : DataTypes.STRING(1000),
      allowNull : true,
      comment : '食谱小窍门'
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
    tableName: 'products',
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    paranoid : true,
    timestamps : true,
    deletedAt : 'destroyTime'
  });
  Product.associate = function(this: Model<any, any>, models: Models) {
    // associations can be defined here

    // 所属用户
    this.belongsTo( models['user'], {
      foreignKey: 'uid',
      as : 'product_user'
    });

    // 所属分类
    this.belongsTo( models['category'], {
      foreignKey: 'cid',
      as : 'product_category'
    });

    // 包含步骤
    this.hasOne( models['step'],{
      foreignKey : 'pid',
      as : 'product_step'
    });

    // 包含评论
    this.hasMany( models['comment'],{
      foreignKey : 'pid',
      as : 'product_comment'
    });

    // 包含收藏
    this.hasMany( models['collection'],{
      foreignKey : 'pid',
      as : 'product_collection'
    });

    //食谱成分
    this.hasOne(models['ingredient'],{
      foreignKey : 'pid',
      as : 'product_ingredient'
    })
  };
  return Product;
};