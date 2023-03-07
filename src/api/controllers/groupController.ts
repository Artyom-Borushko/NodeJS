import { BaseController } from './baseController.js';
import { AddUsersToGroupRequest, RequestWithGroup } from '../../types/requests.js';
import { NextFunction, Request, Response } from 'express';
import { GroupService } from '../../services/groupService.js';
import { BaseGroup } from '../../types/group.js';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';


export class GroupController extends BaseController {
    constructor(private groupService: GroupService) {
        super();
        this.groupService = groupService;
    }

    async createGroup(req: RequestWithGroup, res: Response, next: NextFunction) {
        const group: BaseGroup = req.body;
        try {
            const createdGroup = await this.groupService.create(group);
            this.success(res, createdGroup);
        } catch (e) {
            this.log.error('Method - createGroup, Message - Unable to create group, Props - %O',
                [req, res, next]);
            next(e);
            return;
        }
    }
    async getGroup(req: RequestWithGroup, res: Response, next: NextFunction) {
        const group = req.group;
        try {
            if (!group) {
                throw new EntityNotFoundError('Group can not be found');
            }
            this.success(res, group);
        } catch (e) {
            this.log.error('Method - getGroup, Message - Unable to get group, Props - %O',
                [req, res, next]);
            next(e);
            return;
        }
    }
    async updateGroup(req: RequestWithGroup, res: Response, next: NextFunction) {
        const groupUpdates: BaseGroup = req.body;
        const id: string = req.params.id;
        try {
            const updatedGroup = await this.groupService.update(groupUpdates, id);
            this.success(res, updatedGroup);
        } catch (e) {
            this.log.error('Method - updateGroup, Message - Unable to update group, Props - %O',
                [req, res, next]);
            next(e);
            return;
        }
    }
    async deleteGroup(req: RequestWithGroup, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        const groupToDelete = req.group;
        try {
            await this.groupService.delete(id);
            this.success(res, groupToDelete!);
        } catch (e) {
            this.log.error('Method - deleteGroup, Message - Unable to delete group, Props - %O',
                [req, res, next]);
            next(e);
            return;
        }
    }
    async addUsersToGroup(req: AddUsersToGroupRequest, res: Response, next: NextFunction) {
        const groupId = req.body.groupId;
        const userIds = req.body.usersIds;
        const transaction = await InitializeSequelize.getInstance().transaction();
        try {
            const group = await this.groupService.addUsersToGroup(groupId, userIds, transaction);
            await transaction.commit();
            this.success(res, group);
        } catch (e) {
            this.log.error('Method - addUsersToGroup, Message - Unable to add users to group, Props - %O',
                [req, res, next]);
            await transaction.rollback();
            next(e);
            return;
        }
    }
    async getAllGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const allGroups = await this.groupService.getAll();
            this.success(res, {
                data: {
                    groups: allGroups
                }
            });
        } catch (e) {
            this.log.error('Method - getAllGroups, Message - Unable to get all groups, Props - %O',
                [req, res, next]);
            next(e);
            return;
        }
    }
}
