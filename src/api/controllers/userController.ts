import { RequestWithUser } from '../../types/requests.js';
import { NextFunction, Response } from 'express';
import { UserService } from '../../services/userService.js';
import { BaseUser } from '../../types/user.js';
import { BaseController } from './baseController.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { UserNotFoundError } from '../../core/errors/userNotFoundError.js';


export class UserController extends BaseController {
    private userService: UserService;

    constructor(userServiceInjected: UserService) {
        super();
        this.userService = userServiceInjected;
    }

    async createHandler(req: RequestWithUser, res: Response, next: NextFunction) {
        const user: BaseUser = req.body;
        try {
            const createdUser = await this.userService.create(user);
            this.success(res, UserDataMapper.toClient(createdUser));
        } catch (e) {
            next(e);
            return;
        }
    }

    async getUserById(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            req.user = await this.userService.get(req.params.id);
            if (!req.user) {
                throw new UserNotFoundError('User can not be found');
            }
            next();
            return;
        } catch (e) {
            next(e);
            return;
        }
    }
}
