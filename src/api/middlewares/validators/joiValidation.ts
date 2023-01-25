import { NextFunction, Request, Response } from 'express';
import { ValidationErrorItem } from 'joi';
import { UnprocessedEntityError } from '../../../core/errors/unprocessedEntityError.js';


export class JoiValidation {
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
    validateSchema(schema: any) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, {
                    abortEarly: false,
                    allowUnknown: false
                });
                if (error && error.isJoi) {
                    throw new UnprocessedEntityError('Unprocessed entity error',
                        JoiValidation.errorResponse(error.details));
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
