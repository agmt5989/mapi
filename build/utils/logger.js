"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
/**
 * Logger class logs messages
 * These messages will be printed to console.log if DEBUG=* is defined in the environment variables
 */
class Logger {
    constructor(name) {
        this.name = name;
        this.logLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info';
        const opts = {
            exitOnError: false,
            format: winston_1.default.format.combine(winston_1.default.format.label({
                label: name,
            }), winston_1.default.format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss',
            }), winston_1.default.format.printf((info) => {
                return `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`;
            })),
        };
        opts.transports = [new winston_1.default.transports.Console({ level: this.logLevel })];
        this.logger = winston_1.default.createLogger(opts);
    }
    /** logs a message */
    log(value, level = 'default') {
        const logLevel = level === 'default' ? this.logLevel : level;
        if (value instanceof Error) {
            this.logger.log('error', value.message);
        }
        this.logger.log(logLevel, value);
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map