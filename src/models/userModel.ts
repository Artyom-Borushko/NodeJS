import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { InitializeSequelize } from '../database/postgreSQL/initializeSequelize.js';


class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare id: string;
    declare login: string;
    declare password: string;
    declare age: number;
    declare isdeleted: boolean;
}

UserModel.init({
    id: {
        type: new DataTypes.STRING(128),
        primaryKey: true
    },
    login: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    password: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    age: DataTypes.INTEGER,
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false,
    schema: 'public',
    sequelize: InitializeSequelize.getInstance()
});

export { UserModel };
