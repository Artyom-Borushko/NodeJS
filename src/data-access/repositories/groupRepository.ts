import { DbError } from '../../core/errors/dbError.js';
import { GroupDataMapper } from '../mappers/groupDataMapper.js';
import { BaseGroup, Group } from '../../types/group.js';
import { UserModel } from '../models/userModel.js';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';
import { Transaction } from 'sequelize';


export class GroupRepository {
    private model;
    private dataMapper;

    constructor(groupModel: any, groupDataMapper: GroupDataMapper) {
        this.model = groupModel;
        this.dataMapper = groupDataMapper;
    }

    async get(id: string): Promise<Group | undefined> {
        let groupFromDB;
        try {
            groupFromDB = await this.model.findByPk(id);
        } catch (e) {
            throw new DbError('Error retrieving group');
        }
        return groupFromDB ? this.dataMapper.toDomain(groupFromDB.toJSON()) : undefined;
    }
    async getAll(): Promise<Group | undefined> {
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
        return groupsFromDB.map((group: any) => {
            return this.dataMapper.toDomain(group.toJSON());
        });
    }
    async create(group: Group): Promise<Group> {
        let createdGroup;
        const groupToCreate = this.dataMapper.toDalEntity(group);
        try {
            createdGroup = await this.model.create(groupToCreate);
        } catch (e) {
            throw new DbError('Error creating group');
        }
        return this.dataMapper.toDomain(createdGroup.toJSON());
    }
    async update(groupUpdates: BaseGroup, id: string): Promise<Group> {
        let updatedGroup;
        let rowsUpdate;
        const groupToUpdate = this.dataMapper.toDalEntity(groupUpdates);
        try {
            // eslint-disable-next-line no-unused-vars
            [rowsUpdate, [updatedGroup]] = await this.model.update(groupToUpdate, {
                returning: true,
                where: { id }
            });
        } catch (e) {
            throw new DbError('Error updating group');
        }
        return this.dataMapper.toDomain(updatedGroup.toJSON());
    }
    async delete(id: string, groupToDelete: Group): Promise<Group> {
        try {
            await this.model.destroy({
                returning: true,
                where: { id }
            });
        } catch (e) {
            throw new DbError('Error deleting group');
        }
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
