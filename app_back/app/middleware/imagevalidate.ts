import { Context ,Next} from "koa";
import { APP_ERROR_CODE } from "../utils/constant";

export const imageValidate=function(ctx:Context,next:Next){
    let {file}=(<any>ctx.request).files;
    return next();
}