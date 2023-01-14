/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { Error } from '../../types/errors.js';


export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
    const status = error.statusCode || 500;
    const errorReason = error.errorReason || undefined;

    response.status(status)
        .json({ message: error.message, reason: errorReason });
}
