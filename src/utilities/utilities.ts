import crypto from 'crypto';

export class Utilities {
    static generateUUID(): string {
        return crypto.randomUUID();
    }
}
