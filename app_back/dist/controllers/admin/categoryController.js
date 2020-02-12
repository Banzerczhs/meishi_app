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
const constant_1 = require("../../utils/constant");
async function curd(ctx) {
    let ctxState = ctx.state;
    let model = ctxState.model['category'];
    let result = null;
    let bodyData = ctx.body;
    try {
        switch (ctx.method) {
            case 'GET':
                result = { data: await model.findAll(), msg: '数据获取成功', code: 0 };
                break;
            case 'POST':
                result = { data: null, msg: '数据添加成功', code: 0 };
                let softCategory = await model.findOne({
                    where: {
                        name: bodyData.name
                    },
                    paranoid: false
                });
                if (softCategory.isSoftDeleted()) {
                    softCategory.pid = bodyData.pid;
                    softCategory.alias = bodyData.alias;
                    softCategory.save();
                    softCategory.restore();
                    result.data = softCategory;
                }
                else {
                    result.data = await model.create(Object.assign({}, bodyData));
                }
                break;
            case 'PUT':
                await model.update(Object.assign({}, bodyData), {
                    where: { id: ctx.query.id }
                });
                result = { data: await model.findByPk(ctx.query.id), msg: '数据更新成功', code: 0 };
                break;
            case 'DELETE':
                let where = {
                    [sequelize_1.Op.or]: [
                        { id: ctx.query.id },
                        { pid: ctx.query.id }
                    ]
                };
                await model.destroy({ where });
                result = { data: ctx.query, msg: '数据删除成功', code: 0 };
                break;
        }
    }
    catch (e) {
        result = { msg: e.errors[0].message, code: constant_1.APP_ERROR_CODE['ARGUMENTS_CATE_ERROR'] };
    }
    return result;
}
let AdminController = class AdminController {
    async getCategoryData(ctx) {
        return await curd(ctx);
    }
    async addCategoryData(ctx, body) {
        ctx.body = body;
        return await curd(ctx);
    }
    async updateCategoryData(ctx, body) {
        ctx.body = body;
        return await curd(ctx);
    }
    async deleteCategoryData(ctx) {
        return await curd(ctx);
    }
};
__decorate([
    koa_ts_controllers_1.Get('/categorys'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoryData", null);
__decorate([
    koa_ts_controllers_1.Post('/categorys'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addCategoryData", null);
__decorate([
    koa_ts_controllers_1.Put('/categorys'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategoryData", null);
__decorate([
    koa_ts_controllers_1.Delete('/categorys'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategoryData", null);
AdminController = __decorate([
    koa_ts_controllers_1.Controller('/admin'),
    koa_ts_controllers_1.Flow([authsession_1.authSession])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=categoryController.js.map