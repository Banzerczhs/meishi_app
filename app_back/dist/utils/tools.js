"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const constant_1 = require("../utils/constant");
const path = require("path");
const fs = require("fs");
const KoaStaticCache = require("koa-static-cache");
exports.setStaticCache = (assetsPath, config) => {
    return KoaStaticCache(path.resolve(__dirname, '..' + assetsPath), config);
};
exports.saveAppImage = function (file, type) {
    let ext = '.' + file.name.split('.')[1];
    let filePath = md5(file.name) + '-' + Date.now() + ext;
    return new Promise((res, rej) => {
        try {
            let fileData = fs.readFileSync(file.path);
            let toPath = path.resolve(constant_1.APP_PATH_CONFIG.Image[type], filePath);
            fs.writeFileSync(toPath, fileData);
            res(toPath);
        }
        catch (e) {
            rej({ error: e });
        }
    });
};
exports.fileRename = function (oldName, newName, type) {
    return new Promise((res, rej) => {
        let old = path.resolve(constant_1.APP_PATH_CONFIG.Image[type], oldName);
        let cur = path.resolve(constant_1.APP_PATH_CONFIG.Image[type], newName);
        fs.rename(old, cur, (err) => {
            if (err) {
                rej({ error: err });
            }
            else {
                res(newName);
            }
        });
    });
};
exports.fileDelete = function (filename, type) {
    return new Promise((res, rej) => {
        fs.unlink(path.resolve(constant_1.APP_PATH_CONFIG.Image[type], filename), function (err) {
            if (err) {
                rej({ error: err });
            }
            else {
                res(true);
            }
        });
    });
};
exports.handleIp = function (originIp) {
    let ips = originIp.split('.');
    ips.splice(0, 1, ips[0].match(/\d+/)[0]);
    let newIp = ips.join('.');
    return newIp;
};
//# sourceMappingURL=tools.js.map