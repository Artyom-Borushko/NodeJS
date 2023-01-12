import { BaseUser, User } from '../types/user.js';
import { UserRepository } from '../data-access/userRepository.js';
import { UserUtilities } from '../utilities/userUtilities.js';


class UserService {
    private userRepository: UserRepository;
    private readonly model;
    private readonly dataMapper;
    constructor(userModel: any, userDataMapper: any) {
        this.model = userModel;
        this.dataMapper = userDataMapper;
        this.userRepository = new UserRepository(this.model, this.dataMapper);
    }

    async create(user: BaseUser): Promise<User | undefined> {
        const uuid = UserUtilities.generateUUID();
        const newUser: User = {
            id: uuid,
            isDeleted: false,
            ...user
        };
        return this.userRepository.create(newUser);
    }
    async get(id: string): Promise<User | undefined> {
        const user = await this.userRepository.get(id);
        if (user && !user.isDeleted) {
            return user;
        }
    }
    async update(userUpdates: BaseUser, id: string): Promise<User | undefined> {
        return this.userRepository.update(userUpdates, id);
    }
    async delete(id: string, userToDelete: User): Promise<User | undefined> {
        userToDelete.isDeleted = true;
        return this.userRepository.delete(id, userToDelete);
    }
    getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<(User | undefined)[]> {
        return this.userRepository.getAutoSuggestUsers(loginSubstring, limit);
    }
}

export { UserService };
