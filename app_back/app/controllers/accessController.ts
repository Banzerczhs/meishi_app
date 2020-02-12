import {Controller,Ctx,Post, Body, Get, Flow} from "koa-ts-controllers";
import { Context } from "koa";
import { Model ,Instance} from "sequelize";
import * as md5 from "md5";
import {handleIp} from "../utils/tools";
import {APP_ERROR_CODE} from "../utils/constant";
import {authSession} from "../middleware/authsession";
import {ormLogger, appLogger} from "../utils/logger";

@Controller('/access')
export class AccessController{
    @Post('/login')
    public async handleLogin(@Ctx() ctx:Context,@Body() body:IDB){
        let {username,password}=body;
        let ip=handleIp(ctx.req.connection.remoteAddress);
        let user;
        try{
            user=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).findOne({
                where : {username},
                attributes : {
                    include : ['password']
                }
            });
        }catch(e){
            ormLogger.error(`
                accessController.ts 18 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`
            );
        }

        if(user&&user.password===md5(password)){
            if(typeof ip=='string'){
                user.updated_ip_at=ip;
            }else{
                appLogger.error(`accessController.ts 32 line error_message=variable ip is not string type`);
            }
            //将会话信息存入session
            (<CTXSTATE>ctx.state).storage.set('user',{name : user.get('username')});
            try{
                await user.save();
            }catch(e){
                ormLogger.error(`
                    accessController.ts 40 line error_message=${JSON.stringify(e)}
                    /stack=${JSON.stringify(e.errors)}`
                );
            }
            
            return {code : 0,msg : '用户登录成功',data : {...(<CTXSTATE>ctx.state).storage.get('user')}};
        }else if(!user){
            return {msg : '该用户不存在',code : APP_ERROR_CODE['LOGIN_ERROR']}
        }else{
            return {msg : '用户密码错误',code : APP_ERROR_CODE['LOGIN_ERROR']}
        }
    }

    @Post('/register')
    public async handleRegister(@Ctx() ctx:Context,@Body() body:IDB){
        let result:IDB;
        let ip=handleIp(ctx.req.connection.remoteAddress);
        try{
            let userInfo=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).create({
                ...body,
                created_ip_at : ip,
                updated_ip_at : ip
            });
            (<CTXSTATE>ctx.state).storage.set('user',{name : userInfo.get('username')});
            result={data : {...(<CTXSTATE>ctx.state).storage.get('user')},msg : '用户注册成功',code : 0};
        }catch(e){
            ormLogger.error(`
                accessController.ts 61 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`
            );
            result={msg : '用户注册失败',code : APP_ERROR_CODE['REGIST_ERROR']};
        }
        
        return result;
    }

    @Post('/isEnable')
    public async nameIsEnable(@Ctx() ctx:Context,@Body() body:IDB){
        let user,result;
        try{
            user=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).findOne({
                where : {username : body.name}
            });
            if(user){
                result={msg : '该用户名无法使用',code : APP_ERROR_CODE['USERNAME_REPEAT']};
            }else{
                result={msg : '',code : 0};
            }
        }catch(e){
            ormLogger.error(`
                accessController.ts 83 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`
            );
        }

        return result;
    }


    @Get('/isLogin')
    public async isLogin(@Ctx() ctx:Context){
        let user=(<CTXSTATE>ctx.state).storage.get('user');
        if(user){
            return {data : {...user},code : 0};
        }else{
            return {msg : '您还没有登录',code : APP_ERROR_CODE['SESSION_ERROR']};
        }
    }

    @Get('/loginout')
    public async loginout(@Ctx() ctx:Context){
        let state=(<CTXSTATE>ctx.state).storage.destory('user');
        if(!state){
            appLogger.warn(`accessController.ts 114 line error_message=session error user key no exist`);
        }
        return {msg : '用户退出登录',code : 0};
    }

    @Get('/user_info')
    @Flow([authSession])
    public async getUserInfo(@Ctx() ctx:Context){
        let {name}=(<CTXSTATE>ctx.state).storage.get('user');
        try{
            let userInfo:Instance<any>=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).findOne({
                where : {username : name},
                include : ['user_profile']
            });
            return {msg : '用户信息获取成功',code : 0,data : userInfo};
        }catch(e){
            ormLogger.error(`
                accessController.ts 126 line error_message=${JSON.stringify(e)}
                /stack=${JSON.stringify(e.errors)}`
            );
        }
    }
}