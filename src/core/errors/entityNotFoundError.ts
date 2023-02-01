
export class EntityNotFoundError extends Error {
    protected statusCode = 400;
    constructor(message: string) {
        super(message);
    }
}
