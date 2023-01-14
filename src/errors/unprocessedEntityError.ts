import { Err } from 'joi';

export class UnprocessedEntityError extends Error {
    protected statusCode = 422;
    errorReason?: Err;
    constructor(message: string, errorReason: Err) {
        super(message);
        this.errorReason = errorReason;
    }
}
