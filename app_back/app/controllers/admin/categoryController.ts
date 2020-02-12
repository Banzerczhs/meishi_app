import {Controller,Get,Ctx,Post, Body, Put, Delete,Flow}  from "koa-ts-controllers";
import {Context} from 'koa';
import {authSession} from "../../middleware/authsession";
import { Model ,Op} from "sequelize";
import { APP_ERROR_CODE } from "../../utils/constant";

async function curd(ctx:Context){
    let ctxState=<CTXSTATE>ctx.state;
    let model=ctxState.model['category'];
    let result=null;
    let bodyData=ctx.body;
    try{
        switch(ctx.method){
            case 'GET':
                result={data : await (<Model<any,any>>model).findAll(),msg : '数据获取成功',code : 0};
                break;
            case 'POST':
                result={data:null,msg : '数据添加成功',code : 0};
                let softCategory=await (<Model<any,any>>model).findOne({
                    where : {
                        name : bodyData.name
                    },
                    paranoid : false
                });
                if(softCategory.isSoftDeleted()){
                    softCategory.pid=bodyData.pid;
                    softCategory.alias=bodyData.alias;
                    softCategory.save();
                    softCategory.restore();
                    result.data=softCategory;
                }else{
                    result.data=await (<Model<any,any>>model).create({...bodyData});
                }
                break;
            case 'PUT':
                await (<Model<any,any>>model).update({...bodyData},{
                    where : {id : ctx.query.id}
                });
                result={data : await (<Model<any,any>>model).findByPk(ctx.query.id),msg : '数据更新成功',code : 0}
                break;
            case 'DELETE':
                let where={
                    [Op.or] : [
                        {id : ctx.query.id},
                        {pid : ctx.query.id}
                    ]
                };
                await (<Model<any,any>>model).destroy({where});
                result={data : ctx.query,msg : '数据删除成功',code : 0};
                break;
        }
    }catch(e){
        result={msg : e.errors[0].message,code : APP_ERROR_CODE['ARGUMENTS_CATE_ERROR']}
    }
    
    return result;
}

@Controller('/admin')
@Flow([authSession])
export class AdminController{
    @Get('/categorys')
    public async getCategoryData(@Ctx() ctx:Context){
        return await curd(ctx);
    }

    @Post('/categorys')
    public async addCategoryData(@Ctx() ctx:Context,@Body() body:IDB){
        ctx.body=body;
        return await curd(ctx);
    }

    @Put('/categorys')
    public async updateCategoryData(@Ctx() ctx:Context,@Body() body:IDB){
        ctx.body=body;
        return await curd(ctx);
    }

    @Delete('/categorys')
    public async deleteCategoryData(@Ctx() ctx:Context){
        return await curd(ctx);
    }
}