import { EntityDataMapper } from './entityDataMapper.js';
import { BaseGroup, BaseGroupDB, Group, GroupDB, Permission } from '../../types/group.js';


export class GroupDataMapper extends EntityDataMapper {
    toDomain(groupEntity: Group): Group {
        const arrayOfPermissions = (groupEntity.permissions as unknown as string).split(',');
        const groupCopy = <Group>Object.assign({} as Group, groupEntity);
        groupCopy.permissions = <Permission[]>arrayOfPermissions;
        return groupCopy;
    }
    toDalEntity(group: Group | BaseGroup): GroupDB | BaseGroupDB {
        const stringOfPermissions = <Permission>group.permissions.join(',');
        const groupCopy = <GroupDB>Object.assign({} as GroupDB, group);
        groupCopy.permissions = stringOfPermissions;
        return groupCopy;
    }
}
