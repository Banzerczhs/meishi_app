const path=require('path');
const fs=require('fs');


// fs.symlinkSync(path.resolve(__dirname,'./assets'),'E:/index/text02/meishi_app/app_back/app/assets','dir');

// fs.symlinkSync(path.resolve(__dirname,'../dist/logs'),'E:/index/text02/meishi_app/app_back/app/logs','dir')

(async function(){

    async function ttt(){
        return Array(7).fill(1).map(async item=>{
            return await aaa();
        });
    }
    
    function aaa(){
        return new Promise(async (res,rej)=>{
            res('123');
        })
    }
    
    let p1=await ttt();
    console.log(p1);
    
    async function bbb(){
        let res=await Promise.all(p1);
        console.log(res);
    }
    
    bbb();

})()

