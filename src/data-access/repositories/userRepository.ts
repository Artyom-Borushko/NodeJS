/* eslint-disable no-unused-vars */
import { BaseUser, User } from '../../types/user.js';
import { Op, Transaction } from 'sequelize';
import { DbError } from '../../core/errors/dbError.js';
import { UserGroupModel } from '../models/userGroupModel.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';
import { BaseRepository } from './baseRepository.js';


export class UserRepository extends BaseRepository {
    constructor(userModel: any, userDataMapper: any) {
        super(userModel, userDataMapper);
        this.model = userModel;
        this.dataMapper = userDataMapper;
    }

    async get(id: string): Promise<User | undefined> {
        const userFromDB = await super.getEntityById(id);
        return userFromDB ? this.dataMapper.toDomain(userFromDB.toJSON()) : undefined;
    }
    async create(user: User): Promise<User> {
        const userToCreate = this.dataMapper.toDalEntity(user);
        const createdUser = await super.createEntity(userToCreate);
        return this.dataMapper.toDomain(createdUser.toJSON());
    }
    async update(userUpdates: BaseUser, id: string): Promise<User> {
        const updatedUser = await super.updateEntityById(userUpdates, id);
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
