"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionStorage {
    init(session) {
        this.session = session;
    }
    set(key, val) {
        this.session[key] = val;
    }
    ;
    get(key) {
        return this.session[key];
    }
    ;
    destory(key) {
        if (this.session[key]) {
            this.session[key] = null;
            return true;
        }
        else {
            return false;
        }
    }
    ;
}
exports.SessionStorage = SessionStorage;
;
exports.sessionStorage = new SessionStorage();
//# sourceMappingURL=storage.js.map