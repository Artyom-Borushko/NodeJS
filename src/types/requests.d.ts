import { Request } from 'express';
import { User } from './user.js';
import { Group } from './group.js';


interface RequestWithUser extends Request {
    user?: User;
}

interface RequestWithGroup extends Request {
    group?: Group;
}

interface ReqQuery {
    login?: string;
    limit?: string;
}

export { RequestWithUser, ReqQuery, RequestWithGroup };
