import {Sequelize, Model} from 'sequelize';
import {Session} from "koa-session";
import {SessionStorage} from "../utils/storage";

declare global {
    interface IConf {
        [key: string]: any;
        [index: number]: any;
    }
    interface IDB {
        [key: string]: any;
        [index: number]: any;
    }
    interface CTXSTATE {
        model : IDB,
        storage : SessionStorage
    }
    interface SESSION {
        session : Session
    }
}