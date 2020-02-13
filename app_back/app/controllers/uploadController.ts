import {Controller,Post, Ctx, Flow} from "koa-ts-controllers";
import {Context} from "koa";
import {saveAppImage,handleIp, getCallerFileNameAndLine} from "../utils/tools";
import {authSession} from "../middleware/authsession";
import {imageValidate} from "../middleware/imageValidate";
import { assetsLogger } from "../utils/logger";

@Controller('/assets')
@Flow([authSession,imageValidate])
export class UploadController{
    @Post('/avatar')
    public async uploadAvatar(@Ctx() ctx:Context){
        let {file}=(<any>ctx.request).files;
        let {address,port}=ctx.req.socket.address();
        let ip=handleIp(address);
        try{
            let savePath=await saveAppImage(file,'avatar');
            return {imgUrl : 'http://'+ip+':'+port+'/public/avatars/'+savePath.split(/(\/|\\)/).slice(-1)};
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
            return {imgUrl : 'null'};
        }
    }

    @Post('/cover')   //存储美食成品图片
    public async uploadCover(@Ctx() ctx:Context){
        let {file}=(<any>ctx.request).files;
        let {address,port}=ctx.req.socket.address();
        let ip=handleIp(address);
        try{
            let savePath=await saveAppImage(file,'cover');
            return {imgUrl : 'http://'+ip+':'+port+'/public/images/cover/'+savePath.split(/(\/|\\)/).slice(-1)};
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
            return {imgUrl : 'null'};
        }
    }

    @Post('/step')  //存储制作步骤图片
    public async uploadStep(@Ctx() ctx:Context){
        let {file}=(<any>ctx.request).files;
        let {address,port}=ctx.req.socket.address();
        let ip=handleIp(address);
        try{
            let savePath=await saveAppImage(file,'step');
            return {imgUrl : 'http://'+ip+':'+port+'/public/images/step/'+savePath.split(/(\/|\\)/).slice(-1)};
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
            return {imgUrl : 'null'};
        }
    }
}