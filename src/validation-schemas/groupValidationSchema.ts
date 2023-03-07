import Joi from 'joi';
import { constants } from '../core/constants/constants.js';


export const groupValidationSchema = Joi
    .object()
    .keys({
        name: Joi.string().min(5).max(20).alphanum().required(),
        permissions: Joi.array().items(Joi.string()
            .valid(constants.READ, constants.WRITE, constants.DELETE, constants.SHARE, constants.UPLOAD)).required()
    });
