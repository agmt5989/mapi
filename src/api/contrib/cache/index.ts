import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import Logger from '../../utils/logger';

const logger = new Logger('mono-portal:adapters/cache');

export interface IRedisClient extends RedisClient {
  setExAsync: (key: string, seconds: number, value: string) => Promise<any>;
  expireAsync: (key: string, seconds: number) => Promise<any>;
  setAsync: (key: string, value: string) => Promise<any>;
  getAsync: (key: string) => Promise<any>;
}


const options = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
}

const redisClient = redis.createClient(options) as IRedisClient;

// if password is sent on redis 
if(process.env.REDIS_PASSWORD) {
  redisClient.auth(process.env.REDIS_PASSWORD, (error, result) => {
    if (error && error instanceof Error)
      logger.log(error.message)

    logger.log(result);
  });
}

redisClient.on('error', function (error) {
  if (error instanceof Error)
    logger.log(error.message);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);
const setExAsync = promisify(redisClient.setex).bind(redisClient);

redisClient.setExAsync = setExAsync;
redisClient.getAsync = getAsync;
redisClient.setAsync = setAsync;
redisClient.expireAsync = existsAsync;
redisClient.expireAsync = expireAsync;

export default redisClient