
export class UnauthorizedError extends Error {
    protected statusCode = 401;
    constructor(message: string) {
        super(message);
    }
}
