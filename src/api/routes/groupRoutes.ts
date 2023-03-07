import express, { Router } from 'express';
import { groupValidationSchema } from '../../validation-schemas/groupValidationSchema.js';
import { JoiValidation } from '../middlewares/validators/joiValidation.js';
import { GroupController } from '../controllers/groupController.js';
import { GroupService } from '../../services/groupService.js';
import { GroupModel } from '../../data-access/models/groupModel.js';
import { GroupDataMapper } from '../../data-access/mappers/groupDataMapper.js';
import { usersToGroupValidationSchema } from '../../validation-schemas/usersToGroupValidationSchema.js';
import { AttachGroupMiddleware } from '../middlewares/attachGroupMiddleware.js';
import { UserRepository } from '../../data-access/repositories/userRepository.js';
import { UserModel } from '../../data-access/models/userModel.js';
import { UserGroupModel } from '../../data-access/models/userGroupModel.js';
import { UserGroupRepository } from '../../data-access/repositories/userGroupRepository.js';

const groupRoute: Router = express.Router();
const validation = new JoiValidation();
const userGroupRepository = new UserGroupRepository(UserGroupModel);
const groupService = new GroupService(GroupModel, new GroupDataMapper(),
    new UserRepository(UserModel, userGroupRepository), UserGroupModel,
    userGroupRepository);
const groupController = new GroupController(groupService);
const attachGroupMiddleware = new AttachGroupMiddleware(groupService);


groupRoute.route('/')
    .post(validation.validateSchema(groupValidationSchema),
        groupController.createGroup.bind(groupController)
    )
    .get(groupController.getAllGroups.bind(groupController));

groupRoute.param('id', attachGroupMiddleware.getGroupById.bind(attachGroupMiddleware));

groupRoute.route('/:id')
    .get(groupController.getGroup.bind(groupController))
    .put(validation.validateSchema(groupValidationSchema),
        groupController.updateGroup.bind(groupController)
    )
    .delete(groupController.deleteGroup.bind(groupController));

groupRoute.route('/addUsers')
    .post(validation.validateSchema(usersToGroupValidationSchema),
        groupController.addUsersToGroup.bind(groupController)
    );

export { groupRoute };
