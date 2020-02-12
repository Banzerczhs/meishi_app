import Axios,{AxiosInstance} from "axios";
import api_config from "./api_config";
import {codeMap} from "@/utils";

export const config=api_config[process.env.NODE_ENV];

const axios: AxiosInstance=Axios.create({
    baseURL : config.baseUrl,
    transformRequest : [function (data,headers){
        return JSON.stringify(data);
    }],
    transformResponse : [function (data){
        let resData=JSON.parse(data);
        if(resData.code=='1-01-400'){
            (<ANYOBJ>codeMap)[resData.code]();
        }
        return resData;
    }]
});

export default axios;