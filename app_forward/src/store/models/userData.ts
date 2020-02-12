import {userModify} from "@/request/user";

export interface ISTATE {
    userData: {
        adminUser : {
            current_page : number,
            page_size : number,
            data : Array<object>
        },
        clientUser : {
            current_page : number,
            page_size : number,
            data : Array<object>
        },
        [key : string] : {
            current_page : number,
            page_size : number,
            data : Array<object>
        }
    },
    modify : boolean,
    total : number
}

export function handler(obj:ANYOBJ){
    let newObj:ANYOBJ={};
    Object.keys(obj).forEach(key=>{
        if(Object.prototype.toString.call(obj[key])==="[object Object]"){
            newObj={...handler(obj[key]),...newObj};
        }else{
            if(!obj[key]){
                newObj[key]='——';
            }else{
                newObj[key]=obj[key];
            }
        }
    });
    return {...newObj};
}

const user_module={
    namespaced : true,
    state : {
        userData : {
            adminUser : {
                current_page : 1,
                page_size : 10,
                data : []
            },
            clientUser : {
                current_page : 1,
                page_size : 10,
                data : []
            }
        },
        modify : false,
        total : 0
    },
    mutations: {
        getUserData(state: ISTATE, payload: any) {
            let {key} = payload;
            state.userData[key].data = [...payload.data.userList.rows];
            state.total = payload.data.userList.count;
        },
        addUserData(state: ISTATE, payload: any) {
            let {key} = payload;
            state.userData[key].data.push({...payload.data});
        },
        updateUserData(state: ISTATE, payload: any) {
            let {key} = payload;
            state.userData[key].data = [...state.userData[key].data.map(user => {
                if((<any>user).id == payload.data.id){
                    user = {...payload.data};
                }
                return user;
            })];
        },
        deleteUserData(state: ISTATE, payload: any) {
            let {key} = payload;
            state.userData[key].data = [...state.userData[key].data.filter(user => {
                if ((<any>user).id != payload.data.id){
                    return user;
                }
            })];
            state.total--;
        },
        userDataModify(state: ISTATE,payload:boolean){
            state.modify=payload;
        },
        setCurrentPage(state:ISTATE,payload:ANYOBJ){
            let {key,current_page}=payload;
            state.userData[key].current_page=current_page;
        },
        setPageSize(state:ISTATE,payload:ANYOBJ){
            let {key,page_size}=payload;
            state.userData[key].page_size=page_size;
        }
    },
    actions : {
        getUser(context:STORE['store'],payload:any){
            let {key}=payload;
            return userModify({method : "get",...payload}).then(({data})=>{
                if(!data.code){
                    context.commit('getUserData',{data : {...data.data},key});
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        },
        addUser(context:STORE['store'],payload:any){
            let {key}=payload;
            return userModify({method : "post",...payload}).then(({data})=>{
                if(!data.code){
                    context.commit('addUserData',{data : {...data.data},key});
                    context.commit('userDataModify',true);
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        },
        updateUser(context:STORE['store'],payload:any){
            let {key,idMod}=payload;
            return userModify({method : "put",...payload}).then(({data})=>{
                if(!data.code){
                    context.commit('updateUserData',{data : {...data.data},key});
                    if(idMod){
                        context.commit("addUserData",{data : {...data.data},key});
                        context.commit('userDataModify',true);
                    }
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        },
        deleteUser(context:STORE['store'],payload:any){
            let {key}=payload;
            return userModify({method : "delete",...payload}).then(({data})=>{
                if(!data.code){
                    context.commit('deleteUserData',{data : {...data.data},key});
                    context.commit('userDataModify',true);
                }
                return Promise.resolve({code : data.code,msg : data.msg});
            })
        }
    },
    getters: {
        getUserData(state:ISTATE){
            let copyData:ANYOBJ={};
            Object.keys(state.userData).forEach(key=>{
                copyData[key]=state.userData[key].data.map(item=>{
                    return handler(item);
                })
            });
            return copyData;
        }
    }
}

export default user_module;