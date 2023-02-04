import { RequestWithGroup } from '../../types/requests.js';
import { NextFunction, Response } from 'express';
import { EntityNotFoundError } from '../../core/errors/entityNotFoundError.js';
import { GroupService } from '../../services/groupService.js';


export class AttachGroupMiddleware {
    constructor(
        private groupService: GroupService
    ) {
        this.groupService = groupService;
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
