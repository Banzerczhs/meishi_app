import { Context ,Next} from "koa";
import { APP_ERROR_CODE } from "../utils/constant";

export const authSession=function(ctx:Context,next:Next){
    if(!(<CTXSTATE>ctx.state).storage.get('user')){
        ctx.body={msg : '用户未进行登录',code : APP_ERROR_CODE['TOKEN_INVALID']};
    }else{
        return next();
    }
}