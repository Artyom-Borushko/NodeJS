import { ReqQuery, RequestWithUser } from '../../types/requests';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { BaseUser } from '../../types/user';
import { BaseController } from './baseController';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize';
import { UnauthorizedError } from '../../core/errors/unauthorizedError';
import jwt, { JwtPayload } from 'jsonwebtoken';


export class UserController extends BaseController {
    constructor(private userService: UserService) {
        super();
        this.userService = userService;
    }

    async createUser(req: RequestWithUser, res: Response, next: NextFunction) {
        const user: BaseUser = req.body;
        try {
            const createdUser = await this.userService.create(user);
            this.success(res, UserDataMapper.toClient(createdUser));
        } catch (e) {
            this.log.error('Method - createUser, Message - Unable to create user, Props - %O',
                [req, res, next]);
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
            this.log.error('Method - getUser, Message - Unable to get user, Props - %O',
                [req, res, next]);
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
            this.log.error('Method - updateUser, Message - Unable to update user, Props - %O',
                [req, res, next]);
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
            this.log.error('Method - deleteUser, Message - Unable to delete user, Props - %O',
                [req, res, next]);
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
                this.log.error('Method - getAutoSuggestUsers, Message - Unable to get auto suggest users, Props - %O',
                    [req, res, next]);
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
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: Number(process.env.JWT_TOKEN_LIFE) });
            res.json({ token });
        } catch (e) {
            next(e);
            return;
        }
    }
}
