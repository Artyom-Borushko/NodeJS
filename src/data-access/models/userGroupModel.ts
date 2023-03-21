import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize';
import { UserModel } from './userModel';
import { GroupModel } from './groupModel';


export class UserGroupModel extends Model<InferAttributes<UserGroupModel>, InferCreationAttributes<UserGroupModel>> {
    declare UserId: string;
    declare GroupId: string;
}

UserGroupModel.init({
    UserId: {
        type: new DataTypes.STRING(128),
        references: {
            model: UserModel,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    },
    GroupId: {
        type: new DataTypes.STRING(128),
        references: {
            model: GroupModel,
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }

}, {
    tableName: 'usergroup',
    timestamps: false,
    schema: 'public',
    sequelize: InitializeSequelize.getInstance()
});
