import { UserModel } from '../../data-access/models/userModel.js';
import { GroupModel } from '../../data-access/models/groupModel.js';
import { UserGroupModel } from '../../data-access/models/userGroupModel.js';


export class EntityRelationshipsInitializer {
    static init(): void {
        UserModel.belongsToMany(GroupModel, {
            timestamps: false,
            as: 'groups',
            foreignKey: 'UserId',
            through: UserGroupModel
        });
        GroupModel.belongsToMany(UserModel, {
            timestamps: false,
            as: 'users',
            foreignKey: 'GroupId',
            through: UserGroupModel
        });
    }
}
