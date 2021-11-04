import { ILOGLEVEL } from '../typing/ILogLevels';
/**
 * Logger class logs messages
 * These messages will be printed to console.log if DEBUG=* is defined in the environment variables
 */
export default class Logger {
    name: string;
    logLevel: ILOGLEVEL | string;
    private readonly logger;
    constructor(name: string);
    /** logs a message */
    log(value: string | Error, level?: ILOGLEVEL | string): void;
}
