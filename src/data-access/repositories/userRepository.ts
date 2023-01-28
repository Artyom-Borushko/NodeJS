/* eslint-disable no-unused-vars */
import { BaseUser, User } from '../../types/user.js';
import { Op, Transaction } from 'sequelize';
import { DbError } from '../../core/errors/dbError.js';
import { UserGroupModel } from '../models/userGroupModel.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';


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
        return userFromDB ? this.dataMapper.toDomain(userFromDB.toJSON()) : undefined;
    }
    async create(user: User): Promise<User> {
        let createdUser;
        const userToCreate = this.dataMapper.toDalEntity(user);
        try {
            createdUser = await this.model.create(userToCreate);
        } catch (e) {
            throw new DbError('Error creating user');
        }
        return this.dataMapper.toDomain(createdUser.toJSON());
    }
    async update(userUpdates: BaseUser, id: string): Promise<User> {
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
    async delete(id: string, userToDelete: User): Promise<User> {
        let deletedUser;
        let rowsUpdate;
        const userUpdates = this.dataMapper.toDalEntity(userToDelete);
        try {
            return InitializeSequelize.getInstance().transaction(async (t: Transaction) => {
                [rowsUpdate, [deletedUser]] = await this.model.update(userUpdates, {
                    returning: true,
                    where: { id },
                    transaction: t
                });
                const userEntriesFromDB = await UserGroupModel.findAll({
                    where: { UserId: id },
                    transaction: t
                });
                for (const userEntry of userEntriesFromDB) {
                    await UserGroupModel.destroy({
                        where: { UserId: id },
                        transaction: t
                    });
                }
                return deletedUser;
            });
        } catch (e) {
            throw new DbError('Error deleting user');
        }
    }
    async getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<(User | undefined)[]> {
        let retrievedUsers;
        try {
            retrievedUsers = await this.model.findAll({
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
        return retrievedUsers.map((user: any) => {
            return this.dataMapper.toDomain(user.toJSON());
        });
    }
}
