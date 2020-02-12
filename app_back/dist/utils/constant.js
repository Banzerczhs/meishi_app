"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.APP_PATH_CONFIG = {
    Image: {
        cover: path.resolve(__dirname, '../assets/images/cover'),
        banner: path.resolve(__dirname, '../assets/images/banner'),
        content: path.resolve(__dirname, '../assets/images/content'),
        step: path.resolve(__dirname, '../assets/images/step'),
        avatar: path.resolve(__dirname, '../assets/avatars')
    },
    LogFile: path.resolve(__dirname, '../logs')
};
exports.APP_ERROR_CODE = {
    'LOGIN_ERROR': '1-01-100',
    'REGIST_ERROR': '1-01-101',
    'SESSION_ERROR': '1-01-102',
    'TOKEN_INVALID': '1-01-400',
    'USERNAME_REPEAT': '1-01-110',
    'ARGUMENTS_USER_ERROR': '1-02-100',
    'ARGUMENTS_CATE_ERROR': '1-03-100'
};
//# sourceMappingURL=constant.js.map