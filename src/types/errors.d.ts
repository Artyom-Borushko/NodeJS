
interface BaseError {
    statusCode?: number;
    message?: string;
    errorReason?: object | string;
}

export { BaseError };
