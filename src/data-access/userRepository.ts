/* eslint-disable no-unused-vars */
import { BaseUser, User } from '../types/user.js';
import { Op } from 'sequelize';


class UserRepository {
    private model;
    private dataMapper;

    constructor(userModel: any, userDataMapper: any) {
        this.model = userModel;
        this.dataMapper = userDataMapper;
    }

    async get(id: string): Promise<User | undefined> {
        const userFromDB = await this.model.findByPk(id);
        if (userFromDB) {
            return this.dataMapper.toDomain(userFromDB.toJSON());
        }
    }
    async create(user: User): Promise<User> {
        const userToCreate = this.dataMapper.toDalEntity(user);
        const createdUser = await this.model.create(userToCreate);
        return this.dataMapper.toDomain(createdUser.toJSON());
    }
    async update(userUpdates: BaseUser, id: string): Promise<User | undefined> {
        const [rowsUpdate, [updatedUser]] = await this.model.update(userUpdates, {
            returning: true,
            where: { id }
        });
        return this.dataMapper.toDomain(updatedUser.toJSON());
    }
    async delete(id: string, userToDelete: User): Promise<User | undefined> {
        const userUpdates = this.dataMapper.toDalEntity(userToDelete);
        const [rowsUpdate, [deletedUser]] = await this.model.update(userUpdates, {
            returning: true,
            where: { id }
        });
        return this.dataMapper.toDomain(deletedUser.toJSON());
    }
    async getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<(User | undefined)[]> {
        const retrievedUser = await this.model.findAll({
            where: {
                login: {
                    [Op.substring]: loginSubstring
                }
            },
            order: [
                ['login', 'ASC']
            ],
            limit
        });
        return retrievedUser.map((user: any) => {
            return this.dataMapper.toDomain(user.toJSON());
        });
    }
}

export { UserRepository };
