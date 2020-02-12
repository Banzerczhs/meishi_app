export class SessionStorage{
    protected session: SESSION['session']
    init(session:SESSION['session']){
        this.session=session;
    }
    set(key:string,val:any):void{
        this.session[key]=val;
    };
    get(key:string):any{
        return this.session[key];
    };
    destory(key:string){
        if(this.session[key]){
            this.session[key]=null;
            return true;
        }else{
            return false;
        }
    };
};

export const sessionStorage=new SessionStorage();