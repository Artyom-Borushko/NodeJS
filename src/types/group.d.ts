type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

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

interface GroupDB extends BaseGroupDB{
    id: string;
}

export { Group, BaseGroup, Permission, GroupDB };
