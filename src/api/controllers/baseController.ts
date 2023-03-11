import { Response } from 'express';
import { constants } from '../../core/constants/constants';
import { loggerConfig } from '../../core/configs/logger.config';


export class BaseController {
    protected log = loggerConfig;
    success(res: Response, data: object): Response {
        return res.status(constants.HTTP_SUCCESS)
            .json(data);
    }
}
