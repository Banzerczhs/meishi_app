import axios,{config} from "@/request";

export const productModify= async function(info:REQUESTINFO){
    let {method}=info;
    return await axios.request({
        url : config[method].productData,
        withCredentials : true,
        ...info
    });
};