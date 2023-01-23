import { Response } from 'express';
import { constants } from '../../core/constants/constants.js';


export class BaseController {
    success(res: Response, data: object): Response {
        return res.status(constants.HTTP_SUCCESS)
            .json(data);
    }
}
