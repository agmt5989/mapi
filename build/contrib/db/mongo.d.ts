import 'dotenv/config';
import Obj from '../../typing/Obj';
export default class Mongo {
    configObject: Obj;
    host: string;
    port: string;
    dbname: string;
    authUser: string;
    authPass: string;
    constructor();
    getConfig(env: string): any;
}
