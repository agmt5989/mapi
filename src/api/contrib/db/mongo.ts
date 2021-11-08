import 'dotenv/config';
import mongoose from 'mongoose';
import Logger from '../../utils/logger';
import Obj from '../../typing/Obj';

const logger = new Logger('mono-portal:adapters/mongo');

export default class Mongo {
  public configObject: Obj;

  host: string = process.env.MONGO_DB_HOST || 'localhost';

  port: string = process.env.MDB_PORT || '27019';

  dbname: string = process.env.DATABASE_NAME || 'monodb';

  authUser: string = process.env.MDB_USRNAME || '';

  authPass: string = process.env.MDB_PASSWORD || '';

  constructor() {
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

  public getConfig(env: string) {
    return this.configObject[env];
  }
}

/** connection mongodb */
mongoose.Promise = global.Promise;
// mongoose.set('useFindAndModify', false);
const config = new Mongo();
const dbConfig = config.getConfig(process.env.NODE_ENV || 'development');
mongoose.connect(dbConfig.DATABASE_URL, dbConfig.options, (err) => {
  if (err) logger.log(err.message);
  else {
    logger.log(`Connected to mongodb successfully on ${process.env.NODE_ENV} ${dbConfig.DATABASE_URL}`);
  }
});