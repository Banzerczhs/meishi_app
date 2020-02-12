"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_ts_controllers_1 = require("koa-ts-controllers");
const authsession_1 = require("../../middleware/authsession");
const sequelize_1 = require("sequelize");
const tools_1 = require("../../utils/tools");
const logger_1 = require("../../utils/logger");
let UserController = class UserController {
    async getUserData(ctx) {
        let { currentPage, identity } = ctx.query;
        if (currentPage && typeof Number(currentPage) !== 'number') {
            logger_1.appLogger.error('userController.ts 16 line error_message=type_error property currentPage is not number type');
        }
        if (identity && typeof identity !== 'string') {
            logger_1.appLogger.error('userController.ts 19 line error_message=type_error property identity is not string type');
        }
        let identitys = identity.split('|').map((item) => {
            return { identity: item };
        });
        let pageSize = 10;
        try {
            let userList = await ctx.state.model['user'].findAndCountAll({
                limit: pageSize,
                offset: (Number(currentPage) - 1) * pageSize,
                include: ['user_profile'],
                where: {
                    [sequelize_1.Op.or]: identitys
                }
            });
            let result = { pageSize, currentPage, userList };
            return { data: result, msg: '数据获取成功', code: 0 };
        }
        catch (e) {
            logger_1.ormLogger.error(`
                userController.ts 27 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
    }
    async addUserData(ctx, body) {
        let clientIp = ctx.req.connection.remoteAddress;
        clientIp = tools_1.handleIp(clientIp);
        let { port, address } = ctx.req.socket.address();
        let serverIp = tools_1.handleIp(address);
        let { userSchema, profileSchema } = body;
        let { uimg } = profileSchema;
        let user;
        try {
            user = await ctx.state.model['user'].create(Object.assign(Object.assign({}, userSchema), { created_ip_at: clientIp, updated_ip_at: clientIp }));
        }
        catch (e) {
            logger_1.ormLogger.error(`
                userController.ts 58 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        if (uimg && typeof uimg == 'string') {
            let path = uimg.split('/').slice(-1)[0];
            try {
                let newPath = await tools_1.fileRename(path, `uid=${user.get('id')}-${path}`, 'avatar');
                profileSchema.uimg = 'http://' + serverIp + ':' + port + '/public/avatars/' + newPath;
            }
            catch (e) {
                logger_1.assetsLogger.error(`
                    userController.ts 73 line error_message=${JSON.stringify(e)}
                    /stack=${JSON.stringify(e.errors)}`);
                profileSchema.uimg = '';
            }
        }
        else {
            profileSchema.uimg = '';
        }
        try {
            await ctx.state.model['user-profile'].create(Object.assign(Object.assign({}, profileSchema), { uid: user.get('id') }));
        }
        catch (e) {
            logger_1.ormLogger.error(`
                userController.ts 87 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        let result = await ctx.state.model['user'].findByPk(user.get('id'), {
            include: ['user_profile']
        });
        return { msg: '用户创建成功', code: 0, data: result };
    }
    async updateUserData(ctx, body) {
        let clientIp = ctx.req.connection.remoteAddress;
        clientIp = tools_1.handleIp(clientIp);
        let { port, address } = ctx.req.socket.address();
        let serverIp = tools_1.handleIp(address);
        let { userSchema, profileSchema } = body;
        let { uimg } = profileSchema;
        try {
            await ctx.state.model['user']
                .update(Object.assign({}, userSchema), { where: { id: ctx.query.id } });
        }
        catch (e) {
            logger_1.ormLogger.error(`userController.ts 117 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        let userProfile;
        try {
            userProfile = await ctx.state.model['user-profile']
                .findOne({ where: { uid: ctx.query.id } });
        }
        catch (e) {
            logger_1.ormLogger.error(`userController.ts 128 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        if (uimg && typeof uimg == 'string') {
            let oldPath = userProfile.get('uimg').split('/').slice(-1)[0];
            let path = uimg.split('/').slice(-1)[0].split('-').slice(-2).join('-');
            if (path !== oldPath.split('-').slice(-2).join('-')) {
                try {
                    await tools_1.fileDelete(oldPath, 'avatar');
                }
                catch (e) {
                    logger_1.assetsLogger.error(`
                        userController.ts 142 line error_message=${JSON.stringify(e)}
                        /stack=${JSON.stringify(e.errors)}`);
                    profileSchema.uimg = '';
                }
                try {
                    let newPath = await tools_1.fileRename(path, `uid=${ctx.query.id}-${path}`, 'avatar');
                    profileSchema.uimg = 'http://' + serverIp + ':' + port + '/public/avatars/' + newPath;
                }
                catch (e) {
                    logger_1.assetsLogger.error(`
                        userController.ts 152 line error_message=${JSON.stringify(e)}
                        /stack=${JSON.stringify(e.errors)}`);
                    profileSchema.uimg = '';
                }
            }
        }
        else {
            profileSchema.uimg = '';
        }
        try {
            await ctx.state.model['user-profile']
                .update(Object.assign({}, profileSchema), { where: { uid: ctx.query.id } });
        }
        catch (e) {
            logger_1.ormLogger.error(`userController.ts 167 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        let result = await ctx.state.model['user']
            .findByPk(ctx.query.id, { include: ['user_profile'] });
        return { msg: '用户更新成功', code: 0, data: result };
    }
    async deleteUserData(ctx) {
        try {
            await ctx.state.model['user-profile'].destroy({
                where: { uid: ctx.query.id },
                force: true
            });
            await ctx.state.model['user'].destroy({
                where: { id: ctx.query.id },
                force: true
            });
        }
        catch (e) {
            logger_1.ormLogger.error(`
                userController.ts 187 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        return { data: ctx.query, msg: '数据删除成功', code: 0 };
    }
};
__decorate([
    koa_ts_controllers_1.Get('/users'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserData", null);
__decorate([
    koa_ts_controllers_1.Post('/users'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUserData", null);
__decorate([
    koa_ts_controllers_1.Put('/users'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserData", null);
__decorate([
    koa_ts_controllers_1.Delete('/users'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserData", null);
UserController = __decorate([
    koa_ts_controllers_1.Controller('/admin'),
    koa_ts_controllers_1.Flow([authsession_1.authSession])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map