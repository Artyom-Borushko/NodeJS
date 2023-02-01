import Joi from 'joi';


export const groupValidationSchema = Joi
    .object()
    .keys({
        name: Joi.string().min(5).max(20).alphanum().required(),
        permissions: Joi.array().items(Joi.string()
            .valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).required()
    });
