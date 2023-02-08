import { loggerConfig } from './logger.config.js';


export class Logger {
    static logControllerError(level: string, method: string, message: string, props: any) {
        loggerConfig.log(`${level}`, `Method - ${method}, Message - ${message}, Props - %O`, props);
    }
}
