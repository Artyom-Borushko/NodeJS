import express, { NextFunction, Response, Router } from 'express';
import { groupValidationSchema } from '../../validation-schemas/groupValidationSchema.js';
import { JoiValidation } from '../middlewares/validators/joiValidation.js';
import { GroupController } from '../controllers/groupController.js';
import { GroupService } from '../../services/groupService.js';
import { GroupModel } from '../../data-access/models/groupModel.js';
import { GroupDataMapper } from '../../data-access/mappers/groupDataMapper.js';
import { RequestWithGroup, AddUsersToGroupRequest } from '../../types/requests.js';
import { constants } from '../../core/constants/constants.js';
import { BaseGroup } from '../../types/group.js';
import { usersToGroupValidationSchema } from '../../validation-schemas/usersToGroupValidationSchema.js';

const groupRoute: Router = express.Router();
const validation = new JoiValidation();
const groupService = new GroupService(GroupModel, new GroupDataMapper());
const groupController = new GroupController(groupService);


groupRoute.route('/')
    .post(
        validation.validateSchema(groupValidationSchema),
        groupController.createHandler.bind(groupController)
    )
    .get(
        groupController.getAllGroups.bind(groupController)
    );

groupRoute.param('id', groupController.getGroupById.bind(groupController));

groupRoute.route('/:id')
    .get((req: RequestWithGroup, res: Response) => {
        const group = req.group;
        res.status(constants.HTTP_SUCCESS)
            .json(group);
    })
    .put(validation.validateSchema(groupValidationSchema),
        async (req: RequestWithGroup, res: Response, next: NextFunction) => {
            const groupUpdates: BaseGroup = req.body;
            const id: string = req.params.id;
            try {
                const updatedGroup = await groupService.update(groupUpdates, id);
                res.status(constants.HTTP_SUCCESS)
                    .json(updatedGroup);
            } catch (e) {
                next(e);
                return;
            }
        })
    .delete(async (req: RequestWithGroup, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const groupToDelete = req.group;
        try {
            if (groupToDelete) {
                const deletedGroup = await groupService.delete(id, groupToDelete);
                res.status(constants.HTTP_SUCCESS)
                    .json(deletedGroup);
            }
        } catch (e) {
            next(e);
            return;
        }
    });

groupRoute.route('/addUsers')
    .post(validation.validateSchema(usersToGroupValidationSchema),
        async (req: AddUsersToGroupRequest, res: Response, next: NextFunction) => {
            const groupId = req.body.groupId;
            const userIds = req.body.usersIds;
            try {
                const group = await groupService.addUsersToGroup(groupId, userIds);
                res.status(constants.HTTP_SUCCESS)
                    .json(group);
            } catch (e) {
                next(e);
                return;
            }
        });

export { groupRoute };
