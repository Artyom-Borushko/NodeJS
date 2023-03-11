/* eslint-disable no-unused-vars */
import { BaseUser, UserAuth, UserDB } from '../../types/user';
import { Model, Op, Transaction } from 'sequelize';
import { DbError } from '../../core/errors/dbError';
import { BaseRepository } from './baseRepository';
import { UserModel } from '../models/userModel';
import { UserGroupRepository } from './userGroupRepository';


export class UserRepository extends BaseRepository {
    constructor(userModel: typeof UserModel, private userGroupRepository: UserGroupRepository) {
        super(userModel);
        this.model = userModel;
        this.userGroupRepository = userGroupRepository;
    }

    async get(id: string, transaction?: Transaction): Promise<Model<UserDB> | undefined> {
        return await super.getEntityById(id, transaction);
    }
    async getByLoginAndPassword(params: UserAuth): Promise<Model<UserDB> | undefined> {
        return await super.getEntityByParams({
            where: {
                login: params.login,
                password: params.password
            }
        });
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
