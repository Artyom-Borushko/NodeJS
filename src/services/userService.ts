import { BaseUser, User, UserAuth, UserDB } from '../types/user';
import { UserRepository } from '../data-access/repositories/userRepository';
import { Utilities } from '../utilities/utilities';
import { UserDataMapper } from '../data-access/mappers/userDataMapper';
import { Model, Transaction } from 'sequelize';
import { UserModel } from '../data-access/models/userModel';
import { UserGroupRepository } from '../data-access/repositories/userGroupRepository';


export class UserService {
    private userRepository: UserRepository;
    private readonly model;
    private readonly dataMapper;
    private readonly userGroupRepository;
    constructor(userModel: typeof UserModel, userDataMapper: UserDataMapper, userGroupRepository: UserGroupRepository) {
        this.model = userModel;
        this.dataMapper = userDataMapper;
        this.userGroupRepository = userGroupRepository;
        this.userRepository = new UserRepository(this.model, this.userGroupRepository);
    }

    async create(user: BaseUser): Promise<User> {
        const uuid = Utilities.generateUUID();
        const newUser: User = {
            id: uuid,
            isDeleted: false,
            ...user
        };
        const userToCreate = this.dataMapper.toDalEntity(newUser);
        const createdUser = await this.userRepository.create(userToCreate);
        return this.dataMapper.toDomain(createdUser.toJSON());
    }
    async get(id: string): Promise<User | undefined> {
        const userFromDB = await this.userRepository.get(id);
        if (userFromDB) {
            const userDTO = this.dataMapper.toDomain(userFromDB.toJSON());
            return !userDTO.isDeleted ? userDTO : undefined;
        }
    }
    async update(userUpdates: BaseUser, id: string): Promise<User> {
        const updatedUser = await this.userRepository.update(userUpdates, id);
        return this.dataMapper.toDomain(updatedUser.toJSON());
    }
    async delete(id: string, userToDelete: User, transaction: Transaction): Promise<User> {
        userToDelete.isDeleted = true;
        const userUpdates = this.dataMapper.toDalEntity(userToDelete);
        const deletedUser = await this.userRepository.delete(id, userUpdates, transaction);
        return this.dataMapper.toDomain(deletedUser.toJSON());
    }
    async getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<Array<User | undefined>> {
        const retrievedUsers = await this.userRepository.getAutoSuggestUsers(loginSubstring, limit);
        return retrievedUsers.map((user: Model<UserDB> | undefined) => {
            if (user) return this.dataMapper.toDomain(user.toJSON());
        });
    }
    async getByLoginAndPassword(params: UserAuth): Promise<User | undefined> {
        const userFromDB = await this.userRepository.getByLoginAndPassword(params);
        if (userFromDB) {
            const userDTO = this.dataMapper.toDomain(userFromDB.toJSON());
            return !userDTO.isDeleted ? userDTO : undefined;
        }
    }
}
