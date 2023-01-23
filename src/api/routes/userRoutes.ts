import express, { Request, Response, NextFunction, Router } from 'express';
import { UserService } from '../../services/userService.js';
import { ReqQuery, RequestWithUser } from '../../types/requests.js';
import { BaseUser } from '../../types/user.js';
import { userValidationSchema } from '../../validation-schemas/userValidationSchema.js';
import { UserValidation } from '../middlewares/validators/userValidation.js';
import { UserModel } from '../../data-access/models/userModel.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { UserNotFoundError } from '../../core/errors/userNotFoundError.js';
import { UserController } from '../controllers/userController.js';
import { constants } from '../../core/constants/constants.js';

const userRoute: Router = express.Router();
const userService = new UserService(UserModel, new UserDataMapper());
const validation = new UserValidation();
const userController = new UserController(userService);


userRoute.route('/')
    .post(
        validation.validateSchema(userValidationSchema),
        userController.createHandler.bind(userController)
    )

    .get(async (req: Request<unknown, unknown, unknown, ReqQuery>, res: Response, next: NextFunction) => {
        const loginSubstring: string | undefined = req.query.login;
        const limit: string | undefined = req.query.limit;
        if (loginSubstring && limit && !isNaN(parseInt(limit, 10))) {
            try {
                const suggestedUsers = await userService.getAutoSuggestUsers(loginSubstring, limit);
                if (!suggestedUsers.length) {
                    throw new UserNotFoundError('User can not be found');
                }
                res.status(constants.HTTP_SUCCESS)
                    .json(suggestedUsers);
            } catch (e) {
                next(e);
                return;
            }
        } else {
            next();
            return;
        }
    });


userRoute.param('id', userController.getUserById.bind(userController));

userRoute.route('/:id')
    .get((req: RequestWithUser, res: Response) => {
        const user = req.user;
        res.status(constants.HTTP_SUCCESS)
            .json(user);
    })
    .put(validation.validateSchema(userValidationSchema),
        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            const userUpdates: BaseUser = req.body;
            const id: string = req.params.id;
            try {
                const updatedUser = await userService.update(userUpdates, id);
                res.status(constants.HTTP_SUCCESS)
                    .json(updatedUser);
            } catch (e) {
                next(e);
                return;
            }
        })
    .delete(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const userToDelete = req.user;
        try {
            if (userToDelete) {
                const deletedUser = await userService.delete(id, userToDelete);
                res.status(constants.HTTP_SUCCESS)
                    .json(deletedUser);
            }
        } catch (e) {
            next(e);
            return;
        }
    });

export { userRoute };
