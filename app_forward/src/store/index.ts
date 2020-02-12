import Vue from "vue";
import Vuex from 'vuex';

import Category from "./models/categoryData";
import User,{handler} from "./models/userData";
import Product from "./models/productData";

import {getUserInfo} from "@/request/user";

Vue.use(Vuex);

export interface ISTATE {
    activeMenu: String,
    userInfo: {
        modify :boolean,
        data : Object
    }
}

export const store=new Vuex.Store({
    state : {
        activeMenu : '/',
        userInfo : {
            modify : false,
            data : {}
        }
    },
    mutations : {
        changeRouter(state,payload:string){
            (<ISTATE>state).activeMenu=payload;
        },
        setUserInfo(state,payload:object){
            state.userInfo.data={...payload};
        },
        userInfoModify(state,payload:boolean){
            state.userInfo.modify=payload;
        }
    },
    actions : {
        async getUserInfoData(context){
            return getUserInfo({method : 'get'}).then(({data})=>{
                if(!data.code){
                    context.commit('setUserInfo',{...data.data});
                    context.commit('userInfoModify',false);
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        }
    },
    getters : {
        filterUserInfo(state:ISTATE){
            let res=handler(state.userInfo.data);
            return res;
        }
    },
    modules : {
        cate : <Object>Category,
        user : <Object>User,
        product : <Object>Product
    }
});

export {mapGetters} from "vuex";