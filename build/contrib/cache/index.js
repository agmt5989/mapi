"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const logger_1 = __importDefault(require("../../utils/logger"));
const logger = new logger_1.default('mono-portal:adapters/cache');
const options = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
};
const redisClient = redis_1.default.createClient(options);
// if password is sent on redis 
if (process.env.REDIS_PASSWORD) {
    redisClient.auth(process.env.REDIS_PASSWORD, (error, result) => {
        if (error && error instanceof Error)
            logger.log(error.message);
        logger.log(result);
    });
}
redisClient.on('error', function (error) {
    if (error instanceof Error)
        logger.log(error.message);
});
const getAsync = (0, util_1.promisify)(redisClient.get).bind(redisClient);
const setAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
const existsAsync = (0, util_1.promisify)(redisClient.exists).bind(redisClient);
const expireAsync = (0, util_1.promisify)(redisClient.expire).bind(redisClient);
const setExAsync = (0, util_1.promisify)(redisClient.setex).bind(redisClient);
redisClient.setExAsync = setExAsync;
redisClient.getAsync = getAsync;
redisClient.setAsync = setAsync;
redisClient.expireAsync = existsAsync;
redisClient.expireAsync = expireAsync;
exports.default = redisClient;
//# sourceMappingURL=index.js.map