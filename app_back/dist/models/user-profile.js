'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define('user-profile', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uid: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        uimg: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: '用户头像'
        },
        gender: {
            type: DataTypes.ENUM(['男', '女', '保密']),
            allowNull: false,
            defaultValue: '保密'
        },
        profile: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '个人简介'
        },
        isVip: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        birthday: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        nickname: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ''
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'user_profiles',
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin',
        paranoid: true,
        timestamps: true,
        deletedAt: 'destroyTime'
    });
    UserProfile.associate = function (models) {
        this.belongsTo(models['user'], {
            foreignKey: 'uid',
            as: 'profile_user'
        });
    };
    return UserProfile;
};
//# sourceMappingURL=user-profile.js.map