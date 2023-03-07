import { NextFunction, Request, Response } from 'express';
import { InitializeSequelize } from '../../../database/postgreSQL/initializeSequelize.js';


export class UnhandledExceptionsHandler {
    listenForUnhandledExceptions(req: Request, res: Response, next: NextFunction) {
        process.on('uncaughtException', async (e: Error) => {
            await InitializeSequelize.getInstance().close();
            e.message = 'Unexpected error happened';
            next(e);
        });
        process.on('unhandledRejection', async (e: Error) => {
            await InitializeSequelize.getInstance().close();
            e.message = 'Unexpected error happened';
            next(e);
        });
        next();
    }
}
