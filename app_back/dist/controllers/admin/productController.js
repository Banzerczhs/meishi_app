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
const tools_1 = require("../../utils/tools");
function setAllingredient(ctx, body, productModule) {
    let { ingredientSchema } = body;
    let ingreds = [], result = [];
    Object.keys(ingredientSchema).forEach(key => {
        let { data } = JSON.parse(ingredientSchema[key]);
        if (key == 'rest') {
            let restData = [];
            data.forEach(item => {
                restData.push(...item.data);
            });
            ingreds.push(...restData);
        }
        else {
            ingreds.push(...data);
        }
    });
    ingreds.forEach(item => {
        if (item.name) {
            result.push({
                pid: productModule.get('id'),
                name: item.name,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }
    });
    ctx.state.model['allingredient'].bulkCreate(result, {
        validate: true,
        updateOnDuplicate: ['createdAt', 'updatedAt']
    }).catch((err) => {
        if (err) {
        }
    });
}
function addPidtoImages(imgArr, ctx, pid, type) {
    return JSON.parse(imgArr).map(imgurl => {
        return changeImgName(imgurl, ctx, pid, type);
    });
}
function changeImgName(imgUrl, ctx, pid, type) {
    let clientIp = ctx.req.connection.remoteAddress;
    clientIp = tools_1.handleIp(clientIp);
    let { port, address } = ctx.req.socket.address();
    let serverIp = tools_1.handleIp(address);
    let path = imgUrl.split('/').slice(-1)[0].split('-').slice(-2).join('-');
    return 'http://' + serverIp + ':' + port + '/public/images/' + type + '/' + tools_1.fileRename(path, `pid=${pid}-${path}`, type);
}
function updateImage(origin, referces, ctx, pid, type) {
    let newArr = [];
    let tmpArr = origin.length > referces.length ? origin : referces;
    let urlMap = {};
    origin.forEach(url => urlMap[url] = true);
    for (var i = 0; i < tmpArr.length; i++) {
        let path = referces[i];
        if (!urlMap[referces[i]]) {
            if (origin[i]) {
                let oldPath = origin[i].split('/').slice(-1)[0];
                tools_1.fileDelete(oldPath, type);
            }
            if (referces[i]) {
                path = changeImgName(referces[i], ctx, pid, type);
            }
        }
        path && newArr.push(path);
    }
    return newArr;
}
let ProductController = class ProductController {
    async getProductData(ctx) {
        let result = await ctx.state.model['product'].findAll({
            include: ['product_user', 'product_category', 'product_step', 'product_ingredient']
        });
        return { data: result, code: 0, msg: '数据获取成功' };
    }
    async addProductData(ctx, body) {
        let { productSchema, stepSchema, ingredientSchema } = body;
        let product = await ctx.state
            .model['product'].create(Object.assign({}, productSchema));
        if (JSON.parse(productSchema.cover).join('')) {
            product.cover = JSON.stringify(addPidtoImages(productSchema.cover, ctx, product.get('id'), 'cover'));
        }
        let step = ctx.state
            .model['step'].build(Object.assign({ pid: product.get('id') }, stepSchema));
        if (JSON.parse(stepSchema.pic).join('')) {
            step.pic = JSON.stringify(addPidtoImages(stepSchema.pic, ctx, product.get('id'), 'step'));
        }
        let ingredient = ctx.state
            .model['ingredient'].build(Object.assign({ pid: product.get('id') }, ingredientSchema));
        setAllingredient(ctx, body, product);
        await product.save();
        await step.save();
        await ingredient.save();
        let result = await ctx.state
            .model['product'].findByPk(product.get('id'), {
            include: ['product_user', 'product_category', 'product_step', 'product_ingredient']
        });
        return { data: result, code: 0, msg: '数据添加成功' };
    }
    async updateProductData(ctx, body) {
        let { productSchema, stepSchema, ingredientSchema } = body;
        let product = await ctx.state.model['product'].findOne({
            where: { id: ctx.query.id }
        });
        let step = await ctx.state.model['step'].findOne({
            where: { pid: product.get('id') }
        });
        let newCover = updateImage(JSON.parse(product.get('cover')), JSON.parse(productSchema.cover), ctx, product.get('id'), 'cover');
        let newPic = updateImage(JSON.parse(step.get('pic')), JSON.parse(stepSchema.pic), ctx, product.get('id'), 'step');
        productSchema.cover = JSON.stringify(newCover);
        stepSchema.pic = JSON.stringify(newPic);
        await ctx.state.model['product'].update(Object.assign({}, productSchema), { where: { id: ctx.query.id } });
        await ctx.state.model['step'].update(Object.assign({}, stepSchema), { where: { pid: product.get('id') } });
        await ctx.state.model['ingredient'].update(Object.assign({}, ingredientSchema), { where: { pid: product.get('id') } });
        let result = await ctx.state.model['product'].findByPk(product.get('id'), {
            include: ['product_user', 'product_category', 'product_step', 'product_ingredient']
        });
        return { data: result, code: 0, msg: '数据更新成功' };
    }
    async deleteProductData(ctx) {
        await ctx.state.model['product'].destroy({
            where: { id: ctx.query.id }
        });
        await ctx.state.model['step'].destroy({
            where: { pid: ctx.query.id }
        });
        await ctx.state.model['ingredient'].destroy({
            where: { pid: ctx.query.id }
        });
        return { data: { id: ctx.query.id }, code: 0, msg: '数据删除成功' };
    }
};
__decorate([
    koa_ts_controllers_1.Get('/products'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductData", null);
__decorate([
    koa_ts_controllers_1.Post('/products'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addProductData", null);
__decorate([
    koa_ts_controllers_1.Put('/products'),
    __param(0, koa_ts_controllers_1.Ctx()), __param(1, koa_ts_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProductData", null);
__decorate([
    koa_ts_controllers_1.Delete('/products'),
    __param(0, koa_ts_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProductData", null);
ProductController = __decorate([
    koa_ts_controllers_1.Controller('/admin'),
    koa_ts_controllers_1.Flow([authsession_1.authSession])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map