import {Controller,Get, Ctx,Post, Body, Put, Flow, Delete} from "koa-ts-controllers";
import { Context } from "koa";
import { Model } from "sequelize";
import {authSession} from "../../middleware/authsession";
import {fileRename,handleIp, fileDelete, getCallerFileNameAndLine} from "../../utils/tools";
import { assetsLogger, ormLogger } from "../../utils/logger";


//把用户上传上来的美食信息中的食材信息提取，并存入allIngredient数据库
function setAllingredient(ctx:Context,body:IDB,productModule:any){
    let {ingredientSchema}=body;
    let ingreds:object[]=[],result:object[]=[];
    Object.keys(ingredientSchema).forEach(key=>{
        let {data}=JSON.parse(ingredientSchema[key]);
        if(key=='rest'){
            let restData:object[]=[];
            (<Array<object>>data).forEach(item=>{
                restData.push(...(<any>item).data);
            });
            ingreds.push(...restData);
        }else{
            ingreds.push(...data);
        }
    });
    ingreds.forEach(item=>{
        if((<any>item).name){
            result.push({
                pid : productModule.get('id'),
                name : (<any>item).name,
                createdAt : Date.now(),
                updatedAt : Date.now()
            }) 
        }
    });

    (<Model<any,any>>(<CTXSTATE>ctx.state).model['allingredient']).bulkCreate(result,{
        validate : true,
        updateOnDuplicate : ['createdAt','updatedAt']
    }).catch((err)=>{
        if(err){
            //记录错误信息到程序错误日志中去
            let stack=getCallerFileNameAndLine()
            ormLogger.error({err,stack});
        }
    });
}




//把product表和其中的关联表中的图片名称上加上pid来标示此图片已被使用
function addPidtoImages(imgArr:string,ctx:Context,pid:number,type:string):Promise<string>[]{
    return (<Array<string>>JSON.parse(imgArr)).map(async imgurl=>{
        return await changeImgName(imgurl,ctx,pid,type);
    });
}




//改变图片的名称
function changeImgName(imgUrl:string,ctx:Context,pid:number,type:string):Promise<string>{
    let clientIp=ctx.req.connection.remoteAddress;
    clientIp=handleIp(clientIp);
    let {port,address}=ctx.req.socket.address();
    let serverIp=handleIp(address);
    let path=imgUrl.split('/').slice(-1)[0].split('-').slice(-2).join('-');
    return new Promise(async (res,rej)=>{
        try{
            let newPath=await fileRename(path,`pid=${pid}-${path}`,type);
            res('http://'+serverIp+':'+port+'/public/images/'+type+'/'+newPath);
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
            res('');
        }
    })
}




//更新product模型中的图片信息，
//因为仅仅更新数据库中的数据是远远不够的，
//我们还需要将数据库中的数据映射到服务器
//也就是说需要服务器的资源和数据库中的数据同步
async function updateImage(origin:Array<string>,referces:Array<string>,ctx:Context,pid:number,type:string):Promise<string[]>{
    let newArr:string[]=[];
    let o_len=origin.length||0;
    let r_len=referces.length||0;
    let tmpArr=o_len>r_len?origin:referces;
    let urlMap:any={};
    o_len?origin.forEach(url=>urlMap[url]=true):referces.forEach(url=>urlMap[url]=false);
    for(var i=0;i<tmpArr.length;i++){
        let path=referces[i];
        if(!urlMap[referces[i]]){
            if(origin[i]){
                let oldPath=origin[i].split('/').slice(-1)[0];
                await fileDelete(oldPath,type);
            }
            if(referces[i]){
                path=await changeImgName(referces[i],ctx,pid,type);
            }
        }
        path&&newArr.push(path);
    }
    return newArr;
}




@Controller('/admin')
@Flow([authSession])
export class ProductController{
    @Get('/products')
    public async getProductData(@Ctx() ctx:Context){
        let result=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['product']).findAll({
            include : ['product_user','product_category','product_step','product_ingredient']
        });

        return {data : result,code : 0,msg : '数据获取成功'};
    }



    
    @Post('/products')
    public async addProductData(@Ctx() ctx:Context,@Body() body:IDB){
        let {productSchema,stepSchema,ingredientSchema}=body;

        let product;
        try{
            product=await (<Model<any,any>>(<CTXSTATE>ctx.state)
            .model['product']).create({
                ...productSchema
            });
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }
        
        try{
            if(JSON.parse(productSchema.cover).join('')){
                let coverData=await addPidtoImages(productSchema.cover,ctx,product.get('id'),'cover');
                product.cover=JSON.stringify(await Promise.all(coverData));
            }
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
        }

        let step;
        try{
            step=(<Model<any,any>>(<CTXSTATE>ctx.state)
            .model['step']).build({
                pid : product.get('id'),
                ...stepSchema
            });
        }catch(e){
            let stack=getCallerFileNameAndLine();
            ormLogger.error({e,stack});
        }
        
        try{
            if(JSON.parse(stepSchema.pic).join('')){
                let stepData=addPidtoImages(stepSchema.pic,ctx,product.get('id'),'step')
                step.pic=JSON.stringify(await Promise.all(stepData));
            }
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
        }
        
        let ingredient=(<Model<any,any>>(<CTXSTATE>ctx.state)
        .model['ingredient']).build({
            pid : product.get('id'),
            ...ingredientSchema
        });

        setAllingredient(ctx,body,product);
        await product.save();
        await step.save();
        await ingredient.save();

        let result=await (<Model<any,any>>(<CTXSTATE>ctx.state)
        .model['product']).findByPk(product.get('id'),{
            include : ['product_user','product_category','product_step','product_ingredient']
        });
        return {data : result,code : 0,msg : '数据添加成功'};
    }




    @Put('/products')
    public async updateProductData(@Ctx() ctx:Context,@Body() body:IDB){
        let {productSchema,stepSchema,ingredientSchema}=body;

        //search
        let product=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['product']).findOne({
            where : {id : ctx.query.id}
        });
        let step=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['step']).findOne({
            where : {pid : product.get('id')}
        });
        let newCover;
        try{
            newCover=await updateImage(
                JSON.parse(product.get('cover')),
                JSON.parse(productSchema.cover),
                ctx,product.get('id'),'cover');
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
        }

        let newPic;
        try{
            newPic=await updateImage(
                JSON.parse(step.get('pic')),
                JSON.parse(stepSchema.pic),
                ctx,product.get('id'),'step');
        }catch(e){
            let stack=getCallerFileNameAndLine();
            assetsLogger.error({e,stack});
        }
        
        //update
        productSchema.cover=JSON.stringify(newCover);
        stepSchema.pic=JSON.stringify(newPic);
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['product']).update({
            ...productSchema
        },{where : {id : ctx.query.id}});
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['step']).update({
            ...stepSchema
        },{where : {pid : product.get('id')}});
        
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['ingredient']).update({
            ...ingredientSchema
        },{where : {pid : product.get('id')}});

        let result=await (<Model<any,any>>(<CTXSTATE>ctx.state).model['product']).findByPk(product.get('id'),{
            include : ['product_user','product_category','product_step','product_ingredient']
        })
        return {data : result,code : 0,msg : '数据更新成功'};
    }




    @Delete('/products')
    public async deleteProductData(@Ctx() ctx:Context){
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['product']).destroy({
            where : {id : ctx.query.id}
        })
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['step']).destroy({
            where : {pid : ctx.query.id}
        })
        await (<Model<any,any>>(<CTXSTATE>ctx.state).model['ingredient']).destroy({
            where : {pid : ctx.query.id}
        })

        return {data : {id : ctx.query.id},code : 0,msg : '数据删除成功'};
    }
}