import {categoryModify} from "@/request/category";

export interface ISTATE {
    categoryData : Array<ANYOBJ>
}

const category_module={
    namespaced : true,
    state : {
        categoryData : []
    },
    mutations: {
        getCategoryData(state:ISTATE,payload:Array<Object>){
            state.categoryData=[...payload];
        },
        addCategoryData(state:ISTATE,payload:Array<Object>){
            state.categoryData.push({...payload});
        },
        updateCategoryData(state:ISTATE,payload:ANYOBJ){
            state.categoryData=[...state.categoryData.map(item=>{
                if(item.id==payload.id){
                    item.name=payload.name;
                    item.alias=payload.alias;
                    item.pid=payload.pid;
                }
                return item;
            })]
        },
        deleteCategoryData(state:ISTATE,payload:ANYOBJ){
            state.categoryData=[...state.categoryData.filter(item=>{
                if(item.id!=payload.id){
                    return item;
                }
            })]
        }
    },
    actions : {
        getCategory(context:STORE['store']){
            return categoryModify({method : "get"}).then(({data})=>{
                if(!data.code){
                    context.commit('getCategoryData',[...data.data]);
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            });
        },
        addCategory(context:STORE['store'],payload:ANYOBJ){
            let {data,headers}=payload;
            return categoryModify({method : "post",data,headers}).then(({data})=>{
                if(data.code!==2000){
                    context.commit('addCategoryData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            });
        },
        updateCategory(context:STORE['store'],payload:ANYOBJ){
            let {params,data,headers}=payload;
            return categoryModify({method : 'put',data,headers,params}).then(({data})=>{
                if(data.code!==2000){
                    context.commit('updateCategoryData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        },
        deleteCategory(context:STORE['store'],payload:ANYOBJ){
            let {params}=payload;
            return categoryModify({method : 'delete',params}).then(({data})=>{
                if(data.code!==2000){
                    context.commit('deleteCategoryData',{...data.data});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        }
    },
    getters : {
        generateTree(state:ISTATE){
            //首先对数据进行拷贝
            let copyData=[...state.categoryData];

            function tree(id:Number){
                let toplayer=copyData.filter(item=>item.pid==id);

                toplayer.forEach(item=>{
                    item.children=[...tree(item.id)];
                })

                return toplayer;
            }
            let result=tree(0);
            return result;
        }
    }
}

export default category_module;