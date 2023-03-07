import Joi from 'joi';


export const userValidationSchema = Joi
    .object()
    .keys({
        login: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }).required(),
        password: Joi.string().min(5).max(20).alphanum().required(),
        age: Joi.number().integer().min(4).max(130).required()
    });

export const userAuthValidationSchema = Joi
    .object()
    .keys({
        login: Joi.string().email({
            minDomainSegments: 2,
            tlds: {
                allow: ['com', 'net']
            }
        }).required(),
        password: Joi.string().min(5).max(20).alphanum().required()
    });
