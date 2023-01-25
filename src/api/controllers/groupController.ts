import { BaseController } from './baseController.js';
import { RequestWithGroup } from '../../types/requests.js';
import { NextFunction, Request, Response } from 'express';
import { GroupService } from '../../services/groupService.js';
import { BaseGroup } from '../../types/group.js';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';


export class GroupController extends BaseController {
    private groupService: GroupService;

    constructor(groupServiceInjected: GroupService) {
        super();
        this.groupService = groupServiceInjected;
    }

    async createHandler(req: RequestWithGroup, res: Response, next: NextFunction) {
        const group: BaseGroup = req.body;
        try {
            const createdGroup = await this.groupService.create(group);
            this.success(res, createdGroup);
        } catch (e) {
            next(e);
            return;
        }
    }
    async getAllGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const allGroups = await this.groupService.getAll();
            if (!allGroups) {
                throw new EntityNotFoundError('Group can not be found');
            }
            this.success(res, allGroups);
        } catch (e) {
            next(e);
            return;
        }
    }

    async getGroupById(req: RequestWithGroup, res: Response, next: NextFunction) {
        try {
            req.group = await this.groupService.get(req.params.id);
            if (!req.group) {
                throw new EntityNotFoundError('Group can not be found');
            }
            next();
            return;
        } catch (e) {
            next(e);
            return;
        }
    }
}
