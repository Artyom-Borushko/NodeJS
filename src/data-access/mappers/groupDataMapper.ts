import { EntityDataMapper } from './entityDataMapper';
import { BaseGroup, Group, GroupDB, Permission } from '../../types/group';


export class GroupDataMapper extends EntityDataMapper {
    toDomain(groupEntity: GroupDB): Group {
        const arrayOfPermissions = (groupEntity.permissions).split(',');
        const groupCopy = <Group>Object.assign({} as Group, groupEntity);
        groupCopy.permissions = <Permission[]>arrayOfPermissions;
        return groupCopy;
    }
    toDalEntity(group: Group | BaseGroup): GroupDB {
        const stringOfPermissions = <Permission>group.permissions.join(',');
        const groupCopy = <GroupDB>Object.assign({} as GroupDB, group);
        groupCopy.permissions = stringOfPermissions;
        return groupCopy;
    }
}
