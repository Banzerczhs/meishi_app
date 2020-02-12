import path=require("path");

//静态文件路径配置
export const APP_PATH_CONFIG:IDB={
    Image : {
        cover : path.resolve(__dirname,'../assets/images/cover'),
        banner : path.resolve(__dirname,'../assets/images/banner'),
        content : path.resolve(__dirname,'../assets/images/content'),
        step : path.resolve(__dirname,'../assets/images/step'),
        avatar : path.resolve(__dirname,'../assets/avatars')
    },
    LogFile : path.resolve(__dirname,'../logs')
}

//应用错误状态码
//第一部分代表级别错误，第二部分代表模块，第三部分代表具体错误内容
//1代表应用级错误，01代表用户访问模块
export const APP_ERROR_CODE={
    'LOGIN_ERROR' : '1-01-100',
    'REGIST_ERROR' : '1-01-101',
    'SESSION_ERROR' : '1-01-102',
    'TOKEN_INVALID' : '1-01-400',
    'USERNAME_REPEAT' : '1-01-110',
    'ARGUMENTS_USER_ERROR' : '1-02-100',
    'ARGUMENTS_CATE_ERROR' : '1-03-100'
}