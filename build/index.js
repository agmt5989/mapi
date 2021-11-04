"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
require("./contrib/db/mongo");
// import Routes from './routes';
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const port = process.env.PORT || '8000';
const env = process.env.NODE_ENV || 'development';
const logger = new logger_1.default('mono-portal:index');
app.use((0, helmet_1.default)());
/** Enable Cross Origin Resource Sharing */
app.use((0, cors_1.default)());
app.use((0, connect_timeout_1.default)('5m'));
/** set parser to parse the request data in json format */
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, morgan_1.default)(':date *** :method :: :url ** :response-time'));
// app.use('/pager/v1', Routes);
app.listen(port, () => {
    logger.log(`Server Magic happening on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map