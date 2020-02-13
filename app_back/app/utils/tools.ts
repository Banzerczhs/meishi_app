import {File} from "formidable";
import * as md5 from "md5";
import {APP_PATH_CONFIG} from "../utils/constant";

import path=require('path');
import fs=require('fs');
import KoaStaticCache = require('koa-static-cache');

export const setStaticCache=(assetsPath:string,config:object)=>{
    return KoaStaticCache(path.resolve(__dirname,'..'+assetsPath),config);
}

export const saveAppImage:(file:File,type:string)=>
Promise<any>=function(file:File,type:string): Promise<any>{
    let ext='.'+file.name.split('.')[1];
    let filePath=md5(file.name)+'-'+Date.now()+ext;
    return new Promise((res,rej)=>{
        try{
            let fileData=fs.readFileSync(file.path);
            let toPath=path.resolve(APP_PATH_CONFIG.Image[type],filePath);
            fs.writeFileSync(toPath,fileData);
            res(toPath);
        }catch(e){
            rej({error : e});
        }
    })
}

export const fileRename:(old:string,cur:string,imgtype:string)=>
Promise<any>=function(oldName:string,newName:string,type:string): Promise<any>{
    return new Promise((res,rej)=>{
        let old=path.resolve(APP_PATH_CONFIG.Image[type],oldName);
        let cur=path.resolve(APP_PATH_CONFIG.Image[type],newName);
        fs.rename(old,cur,(err)=>{
            if(err){
                rej({error : err});
            }else{
                res(newName);
            }
        });
    })
}

export const fileDelete:(filename:string,imgtype:string)=>
Promise<any>=function(filename:string,type:string):Promise<any>{
    return new Promise((res,rej)=>{
        fs.unlink(path.resolve(APP_PATH_CONFIG.Image[type],filename),function(err){
            if(err){
                rej({error : err});
            }else{
                res(true);
            }
        })
    })
}

export const handleIp:(origin_ip:string)=>string=function(originIp:string):string {
    let ips=originIp.split('.');
    ips.splice(0,1,ips[0].match(/\d+/)[0]);
    let newIp=ips.join('.');
    return newIp;
}

export const getCallerFileNameAndLine=function(){
    function getException() {
        try {
            throw Error('');
        } catch (err) {
            return err;
        }
    }
        
    const err = getException();
    let stacks=err.stack.split('\n');
    return stacks;
}