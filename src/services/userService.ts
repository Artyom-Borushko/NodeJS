import crypto from 'crypto';
import { BaseUser, User } from '../types/user.js';
import { usersArray } from '../storage/localUsersStorage.js';


class UserService {
    private static generateUUID(): string {
        return crypto.randomUUID();
    }
    create(user: BaseUser): User {
        const uuid = UserService.generateUUID();
        const newUser = {
            id: uuid,
            isDeleted: false,
            ...user
        };
        usersArray.push(newUser);
        return newUser;
    }
    get(id: string): User | undefined {
        return usersArray.find(user => user.id.includes(id) && !user.isDeleted);
    }
    update(userUpdates: BaseUser, id: string): User {
        const updateInstanceIndex = usersArray.findIndex(user => user.id === id);
        if (updateInstanceIndex !== -1) {
            usersArray[updateInstanceIndex] = {
                id,
                isDeleted: false,
                ...userUpdates
            };
        }
        return usersArray[updateInstanceIndex];
    }
    delete(id: string): void {
        const deleteInstanceIndex = usersArray.findIndex(user => user.id === id);
        if (deleteInstanceIndex !== -1) {
            usersArray[deleteInstanceIndex] = {
                ...usersArray[deleteInstanceIndex],
                isDeleted: true
            };
        }
    }
    getAutoSuggestUsers(loginSubstring: string, limit: string): (User | undefined)[] {
        const filteredUsers: User[] = usersArray.filter(user => user.login.includes(loginSubstring) && !user.isDeleted);
        const sortedUsers: User[] = [...filteredUsers].sort((a, b) => {
            const nameA = a.login.toLowerCase();
            const nameB = b.login.toLowerCase();
            if (nameA === nameB) return 0;
            return nameA > nameB ? 1 : -1;
        });
        return sortedUsers.slice(0, parseInt(limit, 10));
    }
}

export { UserService };
