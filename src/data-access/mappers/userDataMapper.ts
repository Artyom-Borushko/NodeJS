import { EntityDataMapper } from './entityDataMapper.js';
import { User, UserDB } from '../../types/user.js';


export class UserDataMapper extends EntityDataMapper {
    toDomain(userEntity: UserDB): User {
        const { isdeleted: isDeleted, ...restProps } = userEntity;
        return { isDeleted, ...restProps };
    }
    toDalEntity(user: User): UserDB {
        const { isDeleted: isdeleted, ...restProps } = user;
        return { isdeleted, ...restProps };
    }
    static toClient(user: User): User {
        const { isDeleted, id, age, password, login } = user;
        return { isDeleted, id, age, password, login };
    }
}
