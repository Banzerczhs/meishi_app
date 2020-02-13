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
const tools_1 = require("../utils/tools");
const authsession_1 = require("../middleware/authsession");
const imageValidate_1 = require("../middleware/imageValidate");
const logger_1 = require("../utils/logger");
let UploadController = class UploadController {
    async uploadAvatar(ctx) {
        let { file } = ctx.request.files;
        let { address, port } = ctx.req.socket.address();
        let ip = tools_1.handleIp(address);
        try {
            let savePath = await tools_1.saveAppImage(file, 'avatar');
            return { imgUrl: 'http://' + ip + ':' + port + '/public/avatars/' + savePath.split(/(\/|\\)/).slice(-1) };
        }
        catch (e) {
            let stack = tools_1.getCallerFileNameAndLine();
            logger_1.assetsLogger.error({ e, stack });
            return { imgUrl: 'null' };
        }
    }
    async uploadCover(ctx) {
        let { file } = ctx.request.files;
        let { address, port } = ctx.req.socket.address();
        let ip = tools_1.handleIp(address);
        try {
            let savePath = await tools_1.saveAppImage(file, 'cover');
            return { imgUrl: 'http://' + ip + ':' + port + '/public/images/cover/' + savePath.split(/(\/|\\)/).slice(-1) };
        }
        catch (e) {
            let stack = tools_1.getCallerFileNameAndLine();
            logger_1.assetsLogger.error({ e, stack });
            return { imgUrl: 'null' };
        }
    }
    async uploadStep(ctx) {
        let { file } = ctx.request.files;
        let { address, port } = ctx.req.socket.address();
        let ip = tools_1.handleIp(address);
        try {
            let savePath = await tools_1.saveAppImage(file, 'step');
            return { imgUrl: 'http://' + ip + ':' + port + '/public/images/step/' + savePath.split(/(\/|\\)/).slice(-1) };
        }
        catch (e) {
            let stack = tools_1.getCallerFileNameAndLine();
            logger_1.assetsLogger.error({ e, stack });
            return { imgUrl: 'null' };
        }
    }
};
__decorate([
    koa_ts_controllers_1.Post('/avatar'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAvatar", null);
__decorate([
    koa_ts_controllers_1.Post('/cover'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadCover", null);
__decorate([
    koa_ts_controllers_1.Post('/step'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadStep", null);
UploadController = __decorate([
    koa_ts_controllers_1.Controller('/assets'),
    koa_ts_controllers_1.Flow([authsession_1.authSession, imageValidate_1.imageValidate])
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=uploadController.js.map