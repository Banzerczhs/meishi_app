import axios,{config} from "@/request";

function initConfig(config:ANYOBJ,...rest:object[]){
    return Object.assign(config,...rest);
}

export const accessLogin=async function(info:ANYOBJ){
    let {method}=info;
    return await axios.request(initConfig(info,{
        url : config[method].accessLogin,
        withCredentials : true
    }));
};

export const accessLoginout=async function(){
    return await axios.request({
        url : config['get'].accessLoginout,
        withCredentials : true
    });
};

export const accessRegister=async function(info:ANYOBJ){
    let {method}=info;
    return await axios.request(initConfig(info,{
        url : config[method].accessRegister,
        withCredentials : true
    }));
};

export const authorization=async function(){
    return await axios.request({
        url : config['get'].authorization,
        withCredentials : true
    })
};

export const nameIsEnable=async function(info:ANYOBJ){
    let {method}=info;
    return await axios.request(initConfig(info,{
        url : config[method].isEnable
    }))
};