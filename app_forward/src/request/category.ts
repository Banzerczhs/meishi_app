import axios,{config} from "@/request";

export const categoryModify= async function(info:REQUESTINFO){
    let {method}=info;
    return await axios.request({
        url : config[method].categoryData,
        withCredentials : true,
        ...info
    });
};