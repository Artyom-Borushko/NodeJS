
export class DbError extends Error {
    protected statusCode = 500;
    constructor(message: string) {
        super(message);
    }
}
