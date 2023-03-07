import { UserGroupModel } from '../models/userGroupModel.js';
import { Transaction } from 'sequelize';
import { BaseRepository } from './baseRepository.js';


export class UserGroupRepository extends BaseRepository {
    constructor(protected model: typeof UserGroupModel) {
        super(model);
    }
    async addUserToGroup(groupId: string, userId: string, transaction: Transaction): Promise<void> {
        const alreadyAssignedUser = await this.model.findOne({
            where: {
                UserId: userId
            },
            transaction
        });
        if (!alreadyAssignedUser) {
            await super.createEntity({
                UserId: userId,
                GroupId: groupId
            }, transaction);
        }
    }
}
