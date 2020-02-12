"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../utils/constant");
exports.authSession = function (ctx, next) {
    if (!ctx.state.storage.get('user')) {
        ctx.body = { msg: '用户未进行登录', code: constant_1.APP_ERROR_CODE['TOKEN_INVALID'] };
    }
    else {
        return next();
    }
};
//# sourceMappingURL=authsession.js.map