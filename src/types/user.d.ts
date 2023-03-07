interface BaseUser {
    login: string;
    password: string;
    age: number;
}

interface User extends BaseUser {
    id: string;
    isDeleted: boolean;
}

interface UserDB {
    login: string;
    password: string;
    age: number;
    id: string;
    isdeleted: boolean;
}

interface UserAuth {
    login: string;
    password: string;
}

export { BaseUser, User, UserDB, UserAuth };
