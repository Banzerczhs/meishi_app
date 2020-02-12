import Koa = require('koa');
import {bootstrapControllers} from "koa-ts-controllers";
import model from "./models";
import {setStaticCache} from "./utils/tools";
import {sessionStorage} from "./utils/storage";
import session = require("koa-session");
import {accessLogger,appLogger} from "./utils/logger";

const CONFIG={
    key : 'koa:sess',
    maxAge : 1000*60*1000,
    autoCommit : true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
}

const app=new Koa();

// 错误处理中间件
app.use(async (ctx, next)=>{
    try {
        await next();
    } catch (error) {
        // 响应用户
        ctx.app.emit('error', error); // 触发应用层级错误事件
    }
});

//开启访问日志进行网站访问记录
app.use(accessLogger());

app.use(setStaticCache('/assets',{
    prefix : '/public',
    gzip : true,
    preload : false,
    dynamic : true
}));

app.use(session(CONFIG,app));

app.keys=['Banzer'];

app.use(async (ctx: Koa.Context,next: Koa.Next)=>{
    ctx.state.model=model;
    ctx.state.storage=sessionStorage;
    ctx.state.storage.init(ctx.session);
    await next();
})

bootstrapControllers(app, {
    // router : 这个选项除非你想使用自己定义的路由系统，否则不要写这一项，这项如果添加的话就会造成后面的选项全部失效
    controllers : [__dirname + '/controllers/**/*.js'],
    disableVersioning : true,
    initBodyParser: true
});

//这里捕获整个应用发出的错误信息，记录到应用日志中去
app.on('error',(err)=>{
    appLogger.error(err);
})

app.listen(8080,function(){
    console.log('服务器开启成功,监听端口号:8080');
});