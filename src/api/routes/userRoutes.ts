import express, { Router } from 'express';
import { UserService } from '../../services/userService.js';
import { userValidationSchema } from '../../validation-schemas/userValidationSchema.js';
import { JoiValidation } from '../middlewares/validators/joiValidation.js';
import { UserModel } from '../../data-access/models/userModel.js';
import { UserDataMapper } from '../../data-access/mappers/userDataMapper.js';
import { UserController } from '../controllers/userController.js';
import { AttachUserMiddleware } from '../middlewares/attachUserMiddleware.js';
import { UserGroupRepository } from '../../data-access/repositories/userGroupRepository.js';
import { UserGroupModel } from '../../data-access/models/userGroupModel.js';

const userRoute: Router = express.Router();
const userService = new UserService(UserModel, new UserDataMapper(), new UserGroupRepository(UserGroupModel));
const validation = new JoiValidation();
const userController = new UserController(userService);
const attachUserMiddleware = new AttachUserMiddleware(userService);


userRoute.route('/')
    .post(validation.validateSchema(userValidationSchema),
        userController.createUser.bind(userController)
    )
    .get(userController.getAutoSuggestUsers.bind(userController));

userRoute.param('id', attachUserMiddleware.getUserById.bind(attachUserMiddleware));

userRoute.route('/:id')
    .get(userController.getUser.bind(userController))
    .put(validation.validateSchema(userValidationSchema),
        userController.updateUser.bind(userController)
    )
    .delete(userController.deleteUser.bind(userController));

export { userRoute };
