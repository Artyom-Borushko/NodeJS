import { Request } from 'express';
import { User } from './user.js';


interface RequestWithUser extends Request {
    user?: User;
}

interface ReqQuery {
    login?: string;
    limit?: string;
}

export { RequestWithUser, ReqQuery };
