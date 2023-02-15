import express, { Router } from 'express';
import { UserService } from '../../services/userService.js';
import { userAuthValidationSchema, userValidationSchema } from '../../validation-schemas/userValidationSchema.js';
import { JoiValidation } from '../middlewares/validators/joiValidation.js';
import { UserModel } from '../../data-access/models/userModel.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { UserController } from '../controllers/userController.js';
import { AttachUserMiddleware } from '../middlewares/attachUserMiddleware.js';
import { UserGroupRepository } from '../../data-access/repositories/userGroupRepository.js';
import { UserGroupModel } from '../../data-access/models/userGroupModel.js';
import { AuthenticationMiddleware } from '../middlewares/authenticationMiddleware.js';

const userRoute: Router = express.Router();
const userService = new UserService(UserModel, new UserDataMapper(), new UserGroupRepository(UserGroupModel));
const validation = new JoiValidation();
const userController = new UserController(userService);
const attachUserMiddleware = new AttachUserMiddleware(userService);
const authenticationMiddleware = new AuthenticationMiddleware();


userRoute.route('/')
    .post(authenticationMiddleware.checkToken,
        validation.validateSchema(userValidationSchema),
        userController.createUser.bind(userController)
    )
    .get(authenticationMiddleware.checkToken,
        userController.getAutoSuggestUsers.bind(userController));

userRoute.param('id', attachUserMiddleware.getUserById.bind(attachUserMiddleware));

userRoute.route('/:id')
    .get(authenticationMiddleware.checkToken,
        userController.getUser.bind(userController))
    .put(authenticationMiddleware.checkToken,
        validation.validateSchema(userValidationSchema),
        userController.updateUser.bind(userController)
    )
    .delete(authenticationMiddleware.checkToken,
        userController.deleteUser.bind(userController));

userRoute.route('/login')
    .post(validation.validateSchema(userAuthValidationSchema),
        userController.authenticateUser.bind(userController));

export { userRoute };
