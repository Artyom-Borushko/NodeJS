/* eslint-disable no-unused-vars */
import { BaseUser, User } from '../types/user.js';
import { Op } from 'sequelize';
import { DbError } from '../errors/dbError.js';


export class UserRepository {
    private model;
    private dataMapper;

    constructor(userModel: any, userDataMapper: any) {
        this.model = userModel;
        this.dataMapper = userDataMapper;
    }

    async get(id: string): Promise<User | undefined> {
        let userFromDB;
        try {
            userFromDB = await this.model.findByPk(id);
        } catch (e) {
            throw new DbError('Error retrieving user');
        }
        if (userFromDB) {
            return this.dataMapper.toDomain(userFromDB.toJSON());
        }
    }
    async create(user: User): Promise<User | undefined> {
        let createdUser;
        const userToCreate = this.dataMapper.toDalEntity(user);
        try {
            createdUser = await this.model.create(userToCreate);
        } catch (e) {
            throw new DbError('Error creating user');
        }
        return this.dataMapper.toDomain(createdUser.toJSON());
    }
    async update(userUpdates: BaseUser, id: string): Promise<User | undefined> {
        let updatedUser;
        let rowsUpdate;
        try {
            [rowsUpdate, [updatedUser]] = await this.model.update(userUpdates, {
                returning: true,
                where: { id }
            });
        } catch (e) {
            throw new DbError('Error updating user');
        }
        return this.dataMapper.toDomain(updatedUser.toJSON());
    }
    async delete(id: string, userToDelete: User): Promise<User | undefined> {
        let deletedUser;
        let rowsUpdate;
        const userUpdates = this.dataMapper.toDalEntity(userToDelete);
        try {
            [rowsUpdate, [deletedUser]] = await this.model.update(userUpdates, {
                returning: true,
                where: { id }
            });
        } catch (e) {
            throw new DbError('Error deleting user');
        }
        return this.dataMapper.toDomain(deletedUser.toJSON());
    }
    async getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<(User | undefined)[]> {
        let retrievedUser;
        try {
            retrievedUser = await this.model.findAll({
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
        } catch (e) {
            throw new DbError('Error retrieving auto suggested users list');
        }
        return retrievedUser.map((user: any) => {
            return this.dataMapper.toDomain(user.toJSON());
        });
    }
}
