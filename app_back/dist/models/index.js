'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const configs = require("../config/config.json");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config = configs;
config = config[env];
let db = {};
function testDatabasecon(db) {
    db.authenticate()
        .then(() => {
        console.log('Connection successfully');
    })
        .catch(() => {
        console.log('Database connection fail');
    });
}
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize.Sequelize(process.env[config.use_env_variable], config);
}
else {
    sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}
testDatabasecon(sequelize);
fs
    .readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
exports.default = db;
//# sourceMappingURL=index.js.map