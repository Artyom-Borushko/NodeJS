import { loggerConfig } from '../../utilities/logger.config.js';
import { NextFunction, Request, Response } from 'express';


export class LoggerMiddleware {
    serviceMethodsLogger(req: Request, res: Response, next: NextFunction) {
        loggerConfig.info(`Method - ${JSON.stringify(req.method)}, URL - ${JSON.stringify(req.url)}, Body - ${JSON.stringify(req.body)}, Query params - ${JSON.stringify(req.query)}`);
        next();
    }
}
