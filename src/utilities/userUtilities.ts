import crypto from 'crypto';

export class UserUtilities {
    static generateUUID(): string {
        return crypto.randomUUID();
    }
}
