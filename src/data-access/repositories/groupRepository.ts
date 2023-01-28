import { DbError } from '../../core/errors/dbError.js';
import { BaseGroup, Group } from '../../types/group.js';
import { UserModel } from '../models/userModel.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';
import { Model, Transaction } from 'sequelize';
import { BaseRepository } from './baseRepository.js';


export class GroupRepository extends BaseRepository {
    constructor(groupModel: any, groupDataMapper: any) {
        super(groupModel, groupDataMapper);
        this.model = groupModel;
        this.dataMapper = groupDataMapper;
    }

    async get(id: string): Promise<Group | undefined> {
        const groupFromDB = await super.getEntityById(id);
        return groupFromDB ? this.dataMapper.toDomain(groupFromDB.toJSON()) : undefined;
    }

    async getAll(): Promise<Array<Group | undefined>> {
        let groupsFromDB;
        try {
            groupsFromDB = await this.model.findAll({
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
        return groupsFromDB.map((group: Model) => {
            return this.dataMapper.toDomain(group.toJSON());
        });
    }
    async create(group: Group): Promise<Group> {
        const groupToCreate = this.dataMapper.toDalEntity(group);
        const createdGroup = await super.createEntity(groupToCreate);
        return this.dataMapper.toDomain(createdGroup.toJSON());
    }
    async update(groupUpdates: BaseGroup, id: string): Promise<Group> {
        const groupToUpdate = this.dataMapper.toDalEntity(groupUpdates);
        const updatedGroup = await super.updateEntityById(groupToUpdate, id);
        return this.dataMapper.toDomain(updatedGroup.toJSON());
    }
    async delete(id: string, groupToDelete: Group): Promise<Group> {
        await super.deleteEntity(id);
        return groupToDelete;
    }

    async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<Group | undefined> {
        try {
            return InitializeSequelize.getInstance().transaction(async (t: Transaction) => {
                const groupFromDB = await this.model.findByPk(groupId, { transaction: t });
                if (groupFromDB) {
                    for (const userId of userIds) {
                        const userFromDB = await UserModel.findByPk(userId, { transaction: t });
                        if (userFromDB && !userFromDB.toJSON().isdeleted) {
                            await groupFromDB.addUser(userFromDB, { transaction: t });
                        } else {
                            throw new DbError('Error retrieving user');
                        }
                    }
                    return this.dataMapper.toDomain(groupFromDB.toJSON());
                }
                throw new DbError('Error retrieving group');
            });
        } catch (e) {
            throw new DbError('Error adding users to group');
        }
    }
}
