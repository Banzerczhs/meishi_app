import {Controller,Get, Ctx,Post, Body, Put, Flow, Delete} from "koa-ts-controllers";
import { Context } from "koa";
import { Model } from "sequelize";
import {authSession} from "../../middleware/authsession";
import {fileRename,handleIp, fileDelete} from "../../utils/tools";


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
        }
    });
}




//把product表和其中的关联表中的图片名称上加上pid来标示此图片已被使用
function addPidtoImages(imgArr:string,ctx:Context,pid:number,type:string):string[]{
    return (<Array<string>>JSON.parse(imgArr)).map(imgurl=>{
        return changeImgName(imgurl,ctx,pid,type);
    });
}




//改变图片的名称
function changeImgName(imgUrl:string,ctx:Context,pid:number,type:string):string{
    let clientIp=ctx.req.connection.remoteAddress;
    clientIp=handleIp(clientIp);
    let {port,address}=ctx.req.socket.address();
    let serverIp=handleIp(address);
    let path=imgUrl.split('/').slice(-1)[0].split('-').slice(-2).join('-');
    return 'http://'+serverIp+':'+port+'/public/images/'+type+'/'+fileRename(path,`pid=${pid}-${path}`,type);
}




//更新product模型中的图片信息，
//因为仅仅更新数据库中的数据是远远不够的，
//我们还需要将数据库中的数据映射到服务器
//也就是说需要服务器的资源和数据库中的数据同步
function updateImage(origin:Array<string>,referces:Array<string>,ctx:Context,pid:number,type:string):string[]{
    let newArr:string[]=[];
    let tmpArr=origin.length>referces.length?origin:referces;
    let urlMap:any={};
    origin.forEach(url=>urlMap[url]=true);
    for(var i=0;i<tmpArr.length;i++){
        let path=referces[i];
        if(!urlMap[referces[i]]){
            if(origin[i]){
                let oldPath=origin[i].split('/').slice(-1)[0];
                fileDelete(oldPath,type);
            }
            if(referces[i]){
                path=changeImgName(referces[i],ctx,pid,type);
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

        let product=await (<Model<any,any>>(<CTXSTATE>ctx.state)
        .model['product']).create({
            ...productSchema
        });
        if(JSON.parse(productSchema.cover).join('')){
            product.cover=JSON.stringify(addPidtoImages(productSchema.cover,ctx,product.get('id'),'cover'));
        }

        let step=(<Model<any,any>>(<CTXSTATE>ctx.state)
        .model['step']).build({
            pid : product.get('id'),
            ...stepSchema
        });
        if(JSON.parse(stepSchema.pic).join('')){
            step.pic=JSON.stringify(addPidtoImages(stepSchema.pic,ctx,product.get('id'),'step'));
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
        let newCover=updateImage(
            JSON.parse(product.get('cover')),
            JSON.parse(productSchema.cover),
            ctx,product.get('id'),'cover');
        let newPic=updateImage(
            JSON.parse(step.get('pic')),
            JSON.parse(stepSchema.pic),
            ctx,product.get('id'),'step');
        
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