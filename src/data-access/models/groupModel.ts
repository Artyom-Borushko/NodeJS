import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { InitializeSequelize } from '../../database/postgreSQL/initializeSequelize.js';
import { Permission } from '../../types/group.js';


export class GroupModel extends Model<InferAttributes<GroupModel>, InferCreationAttributes<GroupModel>> {
    declare id: string;
    declare name: string;
    declare permissions: Array<Permission>;
}

GroupModel.init({
    id: {
        type: new DataTypes.STRING(128),
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    permissions: {
        type: new DataTypes.STRING(128),
        allowNull: false
    }
}, {
    tableName: 'groups',
    timestamps: false,
    schema: 'public',
    sequelize: InitializeSequelize.getInstance()
});
