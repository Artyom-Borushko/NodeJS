import { ReqQuery, RequestWithUser } from '../../types/requests.js';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/userService.js';
import { BaseUser } from '../../types/user.js';
import { BaseController } from './baseController.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';
import { Logger } from '../../utilities/logger.js';
import { UnauthorizedError } from '../../core/errors/unauthorizedError.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { constants } from '../../core/constants/constants.js';


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
            Logger.logControllerError('error', 'createUser', 'Unable to create user',
                { req, res, next });
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
            Logger.logControllerError('error', 'getUser', 'Unable to get user',
                { req, res, next });
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
            Logger.logControllerError('error', 'updateUser', 'Unable to update user',
                { req, res, next });
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
            Logger.logControllerError('error', 'deleteUser', 'Unable to delete user',
                { req, res, next });
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
                Logger.logControllerError('error', 'getAutoSuggestUsers', 'Unable to get auto suggest users',
                    { req, res, next });
                next(e);
                return;
            }
        } else {
            next();
            return;
        }
    }
    async authenticateUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const login: string = req.body.login;
        const password: string = req.body.password;
        try {
            const user = await this.userService.getByLoginAndPassword({ login, password });
            if (!user) {
                throw new UnauthorizedError('Invalid username or password');
            }
            const payload: JwtPayload = { sub: user.id };
            const token = jwt.sign(payload, constants.SECRET, { expiresIn: 300 });
            res.json({ token });
        } catch (e) {
            next(e);
            return;
        }
    }
}
