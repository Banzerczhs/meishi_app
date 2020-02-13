import * as log4js from "koa-log4";
import path=require('path');

log4js.addLayout('json',function(config):any{
    return function(logEvent:any){
        return new Date()+JSON.stringify(logEvent,null,4);
    }
})

log4js.configure({
    appenders : {
        access : {
            type : 'dateFile',
            filename : path.resolve(__dirname,'../logs/access'),
            pattern : '-yyyy-MM-dd.log',
            alwaysIncludePattern : true
        },
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.resolve(__dirname,'../logs/application'),
            alwaysIncludePattern : true
        },
        assets : {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.resolve(__dirname,'../logs/assets'),
            alwaysIncludePattern: true,
            layout : {
                type : 'json'
            }
        },
        sequelize : {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.resolve(__dirname,'../logs/sequelize'),
            alwaysIncludePattern: true
        },
        out: {
            type: 'console'
        }
    },
    categories : {
        default: { appenders: [ 'out' ], level: 'INFO' },
        access : {appenders : ['access'],level : 'INFO'},
        application: { appenders: [ 'application' ], level: 'WARN'},
        assets: {appenders : ['assets'],level : 'WARN'},
        sequelize: {appenders : ['sequelize'],level : 'WARN'}
    }
});


export const accessLogger=()=>log4js.koaLogger(log4js.getLogger('access'));
export const appLogger=log4js.getLogger('application');
export const assetsLogger=log4js.getLogger('assets');
export const ormLogger=log4js.getLogger('sequelize');