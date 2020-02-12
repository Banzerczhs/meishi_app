import {ElMessageBoxShortcutMethod} from "element-ui/types/message-box";
import {Store} from "vuex";
import {Vue} from "vue-property-decorator";
import JQuery from "jquery";

declare global {
    interface ANYOBJ {
        [key : string] : any
    }
    interface STORE {
        store : Store<any>
    }
    interface VUEINSTANCE{
        vue : Vue
    }
    interface REQUESTINFO{
        [key: string] : any,
        method: | 'get' | 'GET'
            | 'delete' | 'DELETE'
            | 'head' | 'HEAD'
            | 'options' | 'OPTIONS'
            | 'post' | 'POST'
            | 'put' | 'PUT'
            | 'patch' | 'PATCH'
            | 'link' | 'LINK'
            | 'unlink' | 'UNLINK'
    }
    interface MSGBOX {
        alert : ElMessageBoxShortcutMethod
    }
    interface JQ{
        jquery : JQuery
    }
}