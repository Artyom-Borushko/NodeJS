import Joi from 'joi';


export const usersToGroupValidationSchema = Joi
    .object()
    .keys({
        groupId: Joi.string().length(36).required(),
        usersIds: Joi.array().items(Joi.string().length(36)).required()
    });
