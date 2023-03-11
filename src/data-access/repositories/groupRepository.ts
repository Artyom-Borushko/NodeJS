import { DbError } from '../../core/errors/dbError';
import { BaseGroupDB, GroupDB } from '../../types/group';
import { UserModel } from '../models/userModel';
import { Model, Transaction } from 'sequelize';
import { BaseRepository } from './baseRepository';
import { UserRepository } from './userRepository';
import { GroupModel } from '../models/groupModel';
import { UserGroupModel } from '../models/userGroupModel';
import { UserGroupRepository } from './userGroupRepository';


export class GroupRepository extends BaseRepository {
    constructor(groupModel: typeof GroupModel, private userRepository: UserRepository,
                private userGroupModel: typeof UserGroupModel, private userGroupRepository: UserGroupRepository) {
        super(groupModel);
        this.userRepository = userRepository;
        this.userGroupModel = userGroupModel;
        this.userGroupRepository = userGroupRepository;
    }

    async get(id: string): Promise<Model<GroupDB> | undefined> {
        return await super.getEntityById(id);
    }
    async getAll(): Promise<Array<Model<GroupDB> | undefined>> {
        try {
            return await this.model.findAll({
                include: [
                    {
                        model: UserModel,
                        as: 'users',
                        attributes: ['id', 'login', 'password', 'age'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });
        } catch (e) {
            throw new DbError('Error retrieving group');
        }
    }
    async create(group: GroupDB): Promise<Model<GroupDB>> {
        return await super.createEntity(group);
    }
    async update(groupUpdates: BaseGroupDB, id: string): Promise<Model<GroupDB>> {
        return await super.updateEntityById(groupUpdates, id);
    }
    async delete(id: string): Promise<void> {
        const rowDeleted = await super.deleteEntity(id);
        if (rowDeleted !== 1) {
            throw new DbError('Error deleting user');
        }
    }
    async addUsersToGroup(groupId: string, userIds: Array<string>, transaction: Transaction): Promise<Model<GroupDB>> {
        try {
            const groupFromDB = await this.model.findByPk(groupId, { transaction });
            if (groupFromDB) {
                for (const userId of userIds) {
                    const userFromDB = await this.userRepository.get(userId, transaction);
                    if (userFromDB && !userFromDB.toJSON().isdeleted) {
                        await this.userGroupRepository.addUserToGroup(groupId, userId, transaction);
                    } else {
                        throw new DbError('Error retrieving user');
                    }
                }
                return groupFromDB;
            }
            throw new DbError('Error retrieving group');
        } catch (e) {
            throw new DbError('Error adding users to group');
        }
    }
}
