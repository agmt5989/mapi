import { RedisClient } from 'redis';
export interface IRedisClient extends RedisClient {
    setExAsync: (key: string, seconds: number, value: string) => Promise<any>;
    expireAsync: (key: string, seconds: number) => Promise<any>;
    setAsync: (key: string, value: string) => Promise<any>;
    getAsync: (key: string) => Promise<any>;
}
declare const redisClient: IRedisClient;
export default redisClient;
