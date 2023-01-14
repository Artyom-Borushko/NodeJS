import { RequestWithUser } from '../types/requests.js';
import { NextFunction, Response } from 'express';
import { UserService } from '../services/userService.js';
import { BaseUser } from '../types/user.js';
import { BaseController } from './baseController.js';


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
            this.success(res, createdUser);
        } catch (e) {
            next(e);
            return;
        }
    }
}
