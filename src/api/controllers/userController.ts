import { ReqQuery, RequestWithUser } from '../../types/requests.js';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/userService.js';
import { BaseUser } from '../../types/user.js';
import { BaseController } from './baseController.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';


export class UserController extends BaseController {
    private userService: UserService;

    constructor(userServiceInjected: UserService) {
        super();
        this.userService = userServiceInjected;
    }

    async createUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const user: BaseUser = req.body;
        try {
            const createdUser = await this.userService.create(user);
            this.success(res, UserDataMapper.toClient(createdUser));
        } catch (e) {
            next(e);
            return;
        }
    }
    async getUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const user = req.user;
        try {
            if (!user) {
                throw new EntityNotFoundError('User can not be found');
            }
            this.success(res, UserDataMapper.toClient(user));
        } catch (e) {
            next(e);
            return;
        }
    }
    async updateUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const userUpdates: BaseUser = req.body;
        const id: string = req.params.id;
        try {
            const updatedUser = await this.userService.update(userUpdates, id);
            this.success(res, UserDataMapper.toClient(updatedUser));
        } catch (e) {
            next(e);
            return;
        }
    }
    async deleteUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        const userToDelete = req.user;
        const transaction = await InitializeSequelize.getInstance().transaction();
        try {
            if (userToDelete) {
                const deletedUser = await this.userService.delete(id, userToDelete, transaction);
                await transaction.commit();
                this.success(res, UserDataMapper.toClient(deletedUser));
            }
        } catch (e) {
            await transaction.rollback();
            next(e);
            return;
        }
    }
    async getAutoSuggestUsers(req: Request<unknown, unknown, unknown, ReqQuery>, res: Response, next: NextFunction) {
        const loginSubstring: string | undefined = req.query.login;
        const limit: string | undefined = req.query.limit;
        if (loginSubstring && limit && !isNaN(parseInt(limit, 10))) {
            try {
                const suggestedUsers = await this.userService.getAutoSuggestUsers(loginSubstring, limit);
                if (!suggestedUsers.length) {
                    throw new EntityNotFoundError('User can not be found');
                }
                this.success(res, suggestedUsers);
            } catch (e) {
                next(e);
                return;
            }
        } else {
            next();
            return;
        }
    }
}
