import { Response } from 'express';
import { constants } from '../constants/constants.js';
import { User } from '../types/user.js';


export class BaseController {
    success(res: Response, data: User): Response {
        return res.status(constants.HTTP_SUCCESS)
            .json(data);
    }
}
