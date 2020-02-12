import axios,{config} from "@/request";

export const userModify= async function(info:REQUESTINFO){
    let {method}=info;
    return await axios.request({
        url : config[method].userData,
        withCredentials : true,
        ...info
    });
};

export const getUserInfo= async function(info:REQUESTINFO){
    let {method}=info;
    return await axios.request({
        url : config[method].userInfo,
        withCredentials : true,
        ...info
    });
};