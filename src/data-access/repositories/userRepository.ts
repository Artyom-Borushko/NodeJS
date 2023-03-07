/* eslint-disable no-unused-vars */
import { BaseUser, UserDB } from '../../types/user.js';
import { Model, Op, Transaction } from 'sequelize';
import { DbError } from '../../core/errors/dbError.js';
import { BaseRepository } from './baseRepository.js';
import { UserModel } from '../models/userModel.js';
import { UserGroupRepository } from './userGroupRepository.js';


export class UserRepository extends BaseRepository {
    constructor(userModel: typeof UserModel, private userGroupRepository: UserGroupRepository) {
        super(userModel);
        this.model = userModel;
        this.userGroupRepository = userGroupRepository;
    }

    async get(id: string, transaction?: Transaction): Promise<Model<UserDB> | undefined> {
        return await super.getEntityById(id, transaction);
    }
    async create(user: UserDB): Promise<Model<UserDB>> {
        return await super.createEntity(user);
    }
    async update(userUpdates: BaseUser, id: string): Promise<Model<UserDB>> {
        return await super.updateEntityById(userUpdates, id);
    }
    async delete(id: string, userUpdates: UserDB, transaction: Transaction): Promise<Model<UserDB>> {
        let deletedUser;
        let rowsUpdate;
        try {
            [rowsUpdate, [deletedUser]] = await this.model.update(userUpdates, {
                returning: true,
                where: { id },
                transaction
            });
            const userEntriesFromDB = await this.userGroupRepository.getAllEntitiesByParams({
                where: { UserId: id },
                transaction
            });
            for (const userEntry of userEntriesFromDB) {
                await this.userGroupRepository.deleteEntityByParams({
                    where: { UserId: id },
                    transaction
                });
            }
            return deletedUser;
        } catch (e) {
            throw new DbError('Error deleting user');
        }
    }
    async getAutoSuggestUsers(loginSubstring: string, limit: string): Promise<Array<Model<UserDB> | undefined>> {
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
        return retrievedUsers;
    }
}
