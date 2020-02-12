"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const koa_ts_controllers_1 = require("koa-ts-controllers");
const models_1 = require("./models");
const tools_1 = require("./utils/tools");
const storage_1 = require("./utils/storage");
const session = require("koa-session");
const logger_1 = require("./utils/logger");
const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 1000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};
const app = new Koa();
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        ctx.app.emit('error', error);
    }
});
app.use(logger_1.accessLogger());
app.use(tools_1.setStaticCache('/assets', {
    prefix: '/public',
    gzip: true,
    preload: false,
    dynamic: true
}));
app.use(session(CONFIG, app));
app.keys = ['Banzer'];
app.use(async (ctx, next) => {
    ctx.state.model = models_1.default;
    ctx.state.storage = storage_1.sessionStorage;
    ctx.state.storage.init(ctx.session);
    await next();
});
koa_ts_controllers_1.bootstrapControllers(app, {
    controllers: [__dirname + '/controllers/**/*.js'],
    disableVersioning: true,
    initBodyParser: true
});
app.on('error', (err) => {
    logger_1.appLogger.error(err);
});
app.listen(8080, function () {
    console.log('服务器开启成功,监听端口号:8080');
});
//# sourceMappingURL=index.js.map