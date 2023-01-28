import { Utilities } from '../utilities/utilities.js';
import { GroupRepository } from '../data-access/repositories/groupRepository.js';
import { GroupDataMapper } from '../data-access/mappers/groupDataMapper.js';
import { BaseGroup, Group } from '../types/group.js';


export class GroupService {
    private groupRepository: GroupRepository;
    private readonly model;
    private readonly dataMapper;

    constructor(groupModel: any, groupDataMapper: GroupDataMapper) {
        this.model = groupModel;
        this.dataMapper = groupDataMapper;
        this.groupRepository = new GroupRepository(this.model, this.dataMapper);
    }

    async create(group: BaseGroup): Promise<Group> {
        const uuid = Utilities.generateUUID();
        const newGroup: Group = {
            id: uuid,
            ...group
        };
        return this.groupRepository.create(newGroup);
    }
    async get(id: string): Promise<Group | undefined> {
        return await this.groupRepository.get(id);
    }
    async getAll(): Promise<Group | undefined> {
        return await this.groupRepository.getAll();
    }
    async update(groupUpdates: BaseGroup, id: string): Promise<Group> {
        return this.groupRepository.update(groupUpdates, id);
    }
    async delete(id: string, groupToDelete: Group): Promise<Group> {
        return this.groupRepository.delete(id, groupToDelete);
    }
    async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<Group | undefined> {
        return this.groupRepository.addUsersToGroup(groupId, userIds);
    }
}
