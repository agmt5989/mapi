"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../../utils/logger"));
const logger = new logger_1.default('mono-portal:adapters/mongo');
class Mongo {
    constructor() {
        this.host = process.env.MONGO_DB_HOST || 'localhost';
        this.port = process.env.MDB_PORT || '27019';
        this.dbname = process.env.DATABASE_NAME || 'monodb';
        this.authUser = process.env.MDB_USRNAME || '';
        this.authPass = process.env.MDB_PASSWORD || '';
        this.configObject = {
            development: {
                DATABASE_URL: process.env.DATABASE_URL || `mongodb://${this.host}:${this.port}/${this.dbname}`,
                DATABASE_HOSTNAME: this.host,
                DATABASE_PORT: this.port,
                DATABASE_NAME: this.dbname,
                options: {
                    user: this.authUser,
                    pass: this.authPass,
                    keepAlive: true,
                    keepAliveInitialDelay: 300000,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
            },
            production: {
                DATABASE_URL: process.env.DATABASE_URL || `mongodb://${this.host}:${this.port}/${this.dbname}`,
                DATABASE_HOSTNAME: this.host,
                DATABASE_PORT: this.port,
                DATABASE_NAME: this.dbname,
                options: {
                    user: this.authUser,
                    pass: this.authPass,
                    keepAlive: true,
                    keepAliveInitialDelay: 300000,
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                },
            },
        };
    }
    getConfig(env) {
        return this.configObject[env];
    }
}
exports.default = Mongo;
/** connection mongodb */
mongoose_1.default.Promise = global.Promise;
// mongoose.set('useFindAndModify', false);
const config = new Mongo();
const dbConfig = config.getConfig(process.env.NODE_ENV || 'development');
mongoose_1.default.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
    if (err)
        logger.log(err.message);
    else {
        logger.log(`Connected to mongodb successfully on ${process.env.NODE_ENV} ${dbConfig.DATABASE_URL}`);
    }
});
//# sourceMappingURL=mongo.js.map