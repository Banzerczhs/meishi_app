import {authorization} from "@/request/access";


interface COOKIE {
    setCookie : (key:string,value:string,time:string)=>void;
    getCookie : (key:string)=>string;
}

export const modCookie:COOKIE={
    setCookie(key,value,time){
        document.cookie=`${key}=${value};expires=${time}`;
    },
    getCookie(key){
        let cookies=document.cookie.split(';');
        let value='';
        cookies.forEach(item=>{
            let hash=item.split('=');
            if(hash[0]==key){
                value=hash[1];
            }
        })
        return value;
    }
}

export const verification={
    timer : 0,
    handler(){
        this.timer=setInterval(async ()=>{
            let {data}=await authorization();
            if(data.code!='1-01-102'){
                window.localStorage.setItem('user',JSON.stringify(data.data));
            }else{
                window.localStorage.removeItem('user');
                sessionMsg.handler();
            }
        },60*1000);
    }
}


export const sessionMsg={
    // @ts-ignore
    handler(){
        let _this:VUEINSTANCE['vue']=this;
        clearInterval(verification.timer);
        _this.$alert('您的登录会话已过期，请点击确认后重新登录','提示信息',{
            confirmButtonText : '确认',
            callback:()=>{
                _this.$router.replace({name : 'login'});
            }
        })
    }
}

export const codeMap={
    '1-01-400' : ()=>{
        localStorage.removeItem('user');
        sessionMsg.handler();
    }
}