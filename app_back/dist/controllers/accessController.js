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
const md5 = require("md5");
const tools_1 = require("../utils/tools");
const constant_1 = require("../utils/constant");
const authsession_1 = require("../middleware/authsession");
const logger_1 = require("../utils/logger");
let AccessController = class AccessController {
    async handleLogin(ctx, body) {
        let { username, password } = body;
        let ip = tools_1.handleIp(ctx.req.connection.remoteAddress);
        let user;
        try {
            user = await ctx.state.model['user'].findOne({
                where: { username },
                attributes: {
                    include: ['password']
                }
            });
        }
        catch (e) {
            logger_1.ormLogger.error(`
                accessController.ts 18 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        if (user && user.password === md5(password)) {
            if (typeof ip == 'string') {
                user.updated_ip_at = ip;
            }
            else {
                logger_1.appLogger.error(`accessController.ts 32 line error_message=variable ip is not string type`);
            }
            ctx.state.storage.set('user', { name: user.get('username') });
            try {
                await user.save();
            }
            catch (e) {
                logger_1.ormLogger.error(`
                    accessController.ts 40 line error_message=${JSON.stringify(e)}
                    /stack=${JSON.stringify(e.errors)}`);
            }
            return { code: 0, msg: '用户登录成功', data: Object.assign({}, ctx.state.storage.get('user')) };
        }
        else if (!user) {
            return { msg: '该用户不存在', code: constant_1.APP_ERROR_CODE['LOGIN_ERROR'] };
        }
        else {
            return { msg: '用户密码错误', code: constant_1.APP_ERROR_CODE['LOGIN_ERROR'] };
        }
    }
    async handleRegister(ctx, body) {
        let result;
        let ip = tools_1.handleIp(ctx.req.connection.remoteAddress);
        try {
            let userInfo = await ctx.state.model['user'].create(Object.assign(Object.assign({}, body), { created_ip_at: ip, updated_ip_at: ip }));
            ctx.state.storage.set('user', { name: userInfo.get('username') });
            result = { data: Object.assign({}, ctx.state.storage.get('user')), msg: '用户注册成功', code: 0 };
        }
        catch (e) {
            logger_1.ormLogger.error(`
                accessController.ts 61 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
            result = { msg: '用户注册失败', code: constant_1.APP_ERROR_CODE['REGIST_ERROR'] };
        }
        return result;
    }
    async nameIsEnable(ctx, body) {
        let user, result;
        try {
            user = await ctx.state.model['user'].findOne({
                where: { username: body.name }
            });
            if (user) {
                result = { msg: '该用户名无法使用', code: constant_1.APP_ERROR_CODE['USERNAME_REPEAT'] };
            }
            else {
                result = { msg: '', code: 0 };
            }
        }
        catch (e) {
            logger_1.ormLogger.error(`
                accessController.ts 83 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
        return result;
    }
    async isLogin(ctx) {
        let user = ctx.state.storage.get('user');
        if (user) {
            return { data: Object.assign({}, user), code: 0 };
        }
        else {
            return { msg: '您还没有登录', code: constant_1.APP_ERROR_CODE['SESSION_ERROR'] };
        }
    }
    async loginout(ctx) {
        let state = ctx.state.storage.destory('user');
        if (!state) {
            logger_1.appLogger.warn(`accessController.ts 114 line error_message=session error user key no exist`);
        }
        return { msg: '用户退出登录', code: 0 };
    }
    async getUserInfo(ctx) {
        let { name } = ctx.state.storage.get('user');
        try {
            let userInfo = await ctx.state.model['user'].findOne({
                where: { username: name },
                include: ['user_profile']
            });
            return { msg: '用户信息获取成功', code: 0, data: userInfo };
        }
        catch (e) {
            logger_1.ormLogger.error(`
                accessController.ts 126 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`);
        }
    }
};
__decorate([
    koa_ts_controllers_1.Post('/login'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "handleLogin", null);
__decorate([
    koa_ts_controllers_1.Post('/register'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "handleRegister", null);
__decorate([
    koa_ts_controllers_1.Post('/isEnable'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "nameIsEnable", null);
__decorate([
    koa_ts_controllers_1.Get('/isLogin'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "isLogin", null);
__decorate([
    koa_ts_controllers_1.Get('/loginout'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "loginout", null);
__decorate([
    koa_ts_controllers_1.Get('/user_info'),
    koa_ts_controllers_1.Flow([authsession_1.authSession]),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "getUserInfo", null);
AccessController = __decorate([
    koa_ts_controllers_1.Controller('/access')
], AccessController);
exports.AccessController = AccessController;
//# sourceMappingURL=accessController.js.map