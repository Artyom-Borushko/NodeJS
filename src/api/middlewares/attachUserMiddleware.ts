import { RequestWithUser } from '../../types/requests.js';
import { NextFunction, Response } from 'express';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';
import { UserService } from '../../services/userService.js';


export class AttachUserMiddleware {
    constructor(
        private userService: UserService
    ) {
        this.userService = userService;
    }
    async getUserById(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            req.user = await this.userService.get(req.params.id);
            if (!req.user) {
                throw new EntityNotFoundError('User can not be found');
            }
            next();
            return;
        } catch (e) {
            next(e);
            return;
        }
    }
}
