import 'dotenv/config';
import morgan from 'morgan';
import bodyparser from 'body-parser';
import cors from 'cors';
import timeout from 'connect-timeout';
import express from 'express';
import helmet from 'helmet';
import './contrib/db/mongo';

// import Routes from './routes';
import Logger from './utils/logger';

const app = express();
const port = process.env.PORT || '8000';

const env = process.env.NODE_ENV || 'development';

const logger = new Logger('mono-portal:index');

app.use(helmet());

/** Enable Cross Origin Resource Sharing */
app.use(cors());

app.use(timeout('5m'));
/** set parser to parse the request data in json format */
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(morgan(':date *** :method :: :url ** :response-time'));

// app.use('/pager/v1', Routes);


app.listen(port, () => {
  logger.log(`Server Magic happening on port ${port}`);
});

export default app;
