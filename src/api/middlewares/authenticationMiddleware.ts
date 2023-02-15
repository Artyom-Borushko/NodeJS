import { RequestWithUser } from '../../types/requests.js';
import { NextFunction, Response } from 'express';
import { UnauthorizedError } from '../../core/errors/unauthorizedError.js';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../../core/errors/forbiddenError.js';
import { constants } from '../../core/constants/constants.js';


export class AuthenticationMiddleware {
    async checkToken(req: RequestWithUser, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'];
        try {
            if (!token) {
                throw new UnauthorizedError('No token provided');
            }
            if (typeof token === 'string') {
                jwt.verify(token, constants.SECRET, (err) => {
                    if (err) {
                        throw new ForbiddenError('Failed authenticate token');
                    }
                    next();
                });
            }
        } catch (e) {
            next(e);
            return;
        }
    }
}
