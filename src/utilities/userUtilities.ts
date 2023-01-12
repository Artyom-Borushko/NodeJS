import crypto from 'crypto';

class UserUtilities {
    static generateUUID(): string {
        return crypto.randomUUID();
    }
}

export { UserUtilities };
