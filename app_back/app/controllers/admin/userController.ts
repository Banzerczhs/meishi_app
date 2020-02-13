import {Controller,Get,Ctx,Post, Body, Put, Delete,Flow}  from "koa-ts-controllers";
import {Context} from 'koa';
import {authSession} from "../../middleware/authsession";
import { Model,Op} from "sequelize";
import {fileRename,handleIp,fileDelete, getCallerFileNameAndLine} from "../../utils/tools";
import { ormLogger, appLogger, assetsLogger } from "../../utils/logger";



@Controller('/admin')
@Flow([authSession])
export class UserController{
    @Get('/users')
    public async getUserData(@Ctx() ctx:Context){
        let {currentPage,identity}=ctx.query;
        if(currentPage&&typeof Number(currentPage)!=='number'){
            appLogger.error('userController.ts 16 line error_message=type_error property currentPage is not number type');
        }
        if(identity&&typeof identity!=='string'){
            appLogger.error('userController.ts 19 line error_message=type_error property identity is not string type');
        }
        let identitys=identity.split('|').map((item:string)=>{
            return {identity : item};
        });
        let pageSize=10;
        try{
            let userList=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).findAndCountAll({
                limit : pageSize,
                offset : (Number(currentPage)-1)*pageSize,
                include : ['user_profile'],
                where : {
                    [Op.or] : identitys
                }
            });
            let result={pageSize,currentPage,userList};
            return {data : result,msg : '数据获取成功',code : 0};
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }
    }




    @Post('/users')
    public async addUserData(@Ctx() ctx:Context,@Body() body:IDB){
        let clientIp=ctx.req.connection.remoteAddress;
        clientIp=handleIp(clientIp);
        let {port,address}=ctx.req.socket.address();
        let serverIp=handleIp(address);
        let {userSchema,profileSchema}=body;
        let {uimg}=profileSchema;
        let user;
        try{
            user=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).create({
                ...userSchema,
                created_ip_at : clientIp,
                updated_ip_at : clientIp
            });
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }

        if(uimg&&typeof uimg=='string'){
            let path=uimg.split('/').slice(-1)[0];
            try{
                let newPath=await fileRename(path,`uid=${user.get('id')}-${path}`,'avatar');
                profileSchema.uimg='http://'+serverIp+':'+port+'/public/avatars/'+newPath;
            }catch(e){
                let stack=getCallerFileNameAndLine();
                assetsLogger.error({e,stack});
                profileSchema.uimg='';
            }
        }else{
            profileSchema.uimg='';
        }

        try{
            await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user-profile']).create({
                ...profileSchema,
                uid : user.get('id')
            })
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }

        let result=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).findByPk(user.get('id'),{
            include : ['user_profile']
        });
        return {msg : '用户创建成功',code : 0,data : result};
    }




    @Put('/users')
    public async updateUserData(@Ctx() ctx:Context,@Body() body:IDB){
        let clientIp=ctx.req.connection.remoteAddress;
        clientIp=handleIp(clientIp);
        let {port,address}=ctx.req.socket.address();
        let serverIp=handleIp(address);
        let {userSchema,profileSchema}=body;
        let {uimg}=profileSchema;

        try{
            await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user'])
            .update({...userSchema},{where : {id : ctx.query.id}});
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }

        let userProfile;
        try{
            userProfile=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user-profile'])
            .findOne({where : {uid : ctx.query.id}})
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }

        if(uimg&&typeof uimg=='string'){
            let oldPath=userProfile.get('uimg').split('/').slice(-1)[0];            
            let path=uimg.split('/').slice(-1)[0].split('-').slice(-2).join('-');
            //如果之前图片名称和新的图片名称不一样的话，则删除掉之前用户存放的头像
            if(path!==oldPath.split('-').slice(-2).join('-')){
                try{
                    await fileDelete(oldPath,'avatar');
                }catch(e){
                    let stack=getCallerFileNameAndLine();
                    assetsLogger.error({e,stack});
                    profileSchema.uimg='';
                }
                try{
                    let newPath=await fileRename(path,`uid=${ctx.query.id}-${path}`,'avatar');

                    profileSchema.uimg='http://'+serverIp+':'+port+'/public/avatars/'+newPath;
                }catch(e){
                    let stack=getCallerFileNameAndLine();
                    assetsLogger.error({e,stack});
                    profileSchema.uimg='';
                }
            }
        }else{
            profileSchema.uimg='';
        }

        try{
            await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user-profile'])
            .update({...profileSchema},{where : {uid : ctx.query.id}});
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }
        
        let result=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user'])
        .findByPk(ctx.query.id,{include : ['user_profile']});
        return {msg : '用户更新成功',code : 0,data : result};
    }




    @Delete('/users')
    public async deleteUserData(@Ctx() ctx:Context){
        try{
            await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user-profile']).destroy({
                where : {uid : ctx.query.id},
                force : true
            });
            await (<Model<any,any>>(<CTXSTATE>ctx.state).model['user']).destroy({
                where : {id : ctx.query.id},
                force : true
            });
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }
        return {data : ctx.query,msg : '数据删除成功',code : 0};
    }
}