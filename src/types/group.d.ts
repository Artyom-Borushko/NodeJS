import { constants } from '../core/constants/constants.js';


type Permission = constants.READ | constants.WRITE | constants.DELETE | constants.SHARE | constants.UPLOAD;

interface BaseGroup {
    name: string;
    permissions: Array<Permission>;
}

interface Group extends BaseGroup {
    id: string;
}

export interface BaseGroupDB {
    name: string;
    permissions: Permission;
}

interface GroupDB extends BaseGroupDB {
    id: string;
}

export { Group, BaseGroup, Permission, GroupDB };
