interface BaseUser {
    login: string;
    password: string;
    age: number;
}

interface User extends BaseUser {
    id: string;
    isDeleted: boolean;
}

export { BaseUser, User };
