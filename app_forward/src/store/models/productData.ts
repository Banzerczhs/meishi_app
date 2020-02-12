import {productModify} from "@/request/product";

export interface ISTATE {
    productData : Array<ANYOBJ>,
    modify : boolean
}

const product_module={
    namespaced : true,
    state : {
        productData : [],
        modify : false
    },
    mutations: {
        getProductData(state:ISTATE,payload:Array<Object>){
            state.productData=[...payload];
        },
        addProductData(state:ISTATE,payload:Array<Object>){
            state.productData.push({...payload});
        },
        updateProductData(state:ISTATE,payload:ANYOBJ){
            state.productData=[...state.productData.map(item=>{
                if(item.id==payload.id){
                    item.name=payload.name;
                    item.alias=payload.alias;
                    item.pid=payload.pid;
                }
                return item;
            })];
        },
        deleteProductData(state:ISTATE,payload:ANYOBJ){
            state.productData=[...state.productData.filter(item=>{
                if(item.id!=payload.id){
                    return item;
                }
            })];
        },
        setProductModify(state:ISTATE,payload:boolean){
            state.modify=payload;
        }
    },
    actions : {
        getProduct(context:STORE['store']){
            return productModify({method : "get"}).then(({data})=>{
                if(!data.code){
                    context.commit('getProductData',[...data.data]);
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            });
        },
        addProduct(context:STORE['store'],payload:ANYOBJ){
            let {data,headers}=payload;
            return productModify({method : "post",data,headers}).then(({data})=>{
                if(!data.code){
                    context.commit('addProductData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            });
        },
        updateProduct(context:STORE['store'],payload:ANYOBJ){
            let {params,data,headers}=payload;
            return productModify({method : 'put',data,headers,params}).then(({data})=>{
                if(!data.code){
                    context.commit('updateProductData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        },
        deleteProduct(context:STORE['store'],payload:ANYOBJ){
            let {params}=payload;
            return productModify({method : 'delete',params}).then(({data})=>{
                if(!data.code){
                    context.commit('deleteProductData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        }
    },
    getters : {

    }
}

export default product_module;