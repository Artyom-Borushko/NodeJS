import express, { Request, Response, NextFunction, Router } from 'express';
import { UserService } from '../services/userService.js';
import { ReqQuery, RequestWithUser } from '../types/requests.js';
import { BaseUser, User } from '../types/user.js';
import { userValidationSchema } from '../validation-schemas/userValidationSchema.js';
import { UserValidation } from '../middlewares/validations/userValidation.js';
import { UserModel } from '../models/userModel.js';
import { UserDataMapper } from '../data-access/data-mappers/userDataMapper.js';

const userRoute: Router = express.Router();
const userService = new UserService(UserModel, new UserDataMapper());
const validation = new UserValidation();


userRoute.route('/')
    .post(validation.validateSchema(userValidationSchema),
        async (req: Request, res: Response) => {
            const user: BaseUser = req.body;
            const createdUser: User | undefined = await userService.create(user);
            res.status(200)
                .json(createdUser);
        })
    .get(async (req: Request<unknown, unknown, unknown, ReqQuery>, res: Response, next: NextFunction) => {
        const loginSubstring: string | undefined = req.query.login;
        const limit: string | undefined = req.query.limit;
        if (loginSubstring && limit && !isNaN(parseInt(limit, 10))) {
            const suggestedUsers = await userService.getAutoSuggestUsers(loginSubstring, limit);
            if (!suggestedUsers.length) {
                res.status(404)
                    .json({ message: `Users with login substring ${req.query.login} not found` });
            } else {
                res.status(200)
                    .json(suggestedUsers);
            }
        } else {
            next();
            return;
        }
    });


userRoute.param('id', async (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.user = await userService.get(req.params.id);
    next();
});

userRoute.route('/:id')
    .get((req: RequestWithUser, res: Response) => {
        const user: User | undefined = req.user;
        if (!user) {
            res.status(404)
                .json({ message: `User with id ${req.params.id} not found to retrieve` });
        } else {
            res.status(200)
                .json(user);
        }
    })
    .put(validation.validateSchema(userValidationSchema),
        async (req: RequestWithUser, res: Response) => {
            const userToUpdate: User | undefined = req.user;
            const userUpdates: BaseUser = req.body;
            const id: string = req.params.id;
            if (!userToUpdate) {
                res.status(404)
                    .json({ message: `User with id ${req.params.id} not found to update` });
            } else {
                const updatedUser = await userService.update(userUpdates, id);
                res.status(200)
                    .json(updatedUser);
            }
        })
    .delete(async (req: RequestWithUser, res: Response) => {
        const id: string = req.params.id;
        const userToDelete: User | undefined = req.user;
        if (!userToDelete) {
            res.status(404)
                .json({ message: `User with id ${req.params.id} not found to delete` });
        } else {
            const deletedUser = await userService.delete(id, userToDelete);
            res.status(200)
                .json(deletedUser);
        }
    });

export { userRoute };
