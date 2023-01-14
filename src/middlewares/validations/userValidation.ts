import { NextFunction, Request, Response } from 'express';
import { ValidationErrorItem } from 'joi';
import { userValidationSchema } from '../../validation-schemas/userValidationSchema.js';
import { UnprocessedEntityError } from '../../errors/unprocessedEntityError.js';


export class UserValidation {
    private static errorResponse(schemaErrors: Array<ValidationErrorItem>) {
        const errors = schemaErrors.map((error) => {
            const { path, message } = error;
            return { path, message };
        });
        return {
            status: 'failed',
            errors
        };
    }
    validateSchema(schema: typeof userValidationSchema) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, {
                    abortEarly: false,
                    allowUnknown: false
                });
                if (error && error.isJoi) {
                    throw new UnprocessedEntityError('Unprocessed entity error',
                        UserValidation.errorResponse(error.details));
                }
                next();
                return;
            } catch (e) {
                next(e);
                return;
            }
        };
    }
}
