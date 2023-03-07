
export class ForbiddenError extends Error {
    protected statusCode = 403;
    constructor(message: string) {
        super(message);
    }
}
