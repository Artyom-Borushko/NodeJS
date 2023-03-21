import { Utilities } from '../utilities/utilities';
import { GroupRepository } from '../data-access/repositories/groupRepository';
import { GroupDataMapper } from '../data-access/mappers/groupDataMapper';
import { BaseGroup, Group, GroupDB } from '../types/group';
import { Model, Transaction } from 'sequelize';
import { GroupModel } from '../data-access/models/groupModel';
import { UserRepository } from '../data-access/repositories/userRepository';
import { UserGroupModel } from '../data-access/models/userGroupModel';
import { UserGroupRepository } from '../data-access/repositories/userGroupRepository';


export class GroupService {
    private groupRepository: GroupRepository;
    private readonly model;
    private readonly dataMapper;
    private readonly userRepository;
    private readonly userGroupModel;
    private readonly userGroupRepository;

    constructor(groupModel: typeof GroupModel, groupDataMapper: GroupDataMapper, userRepository: UserRepository,
        userGroupModel: typeof UserGroupModel, userGroupRepository: UserGroupRepository) {
        this.model = groupModel;
        this.dataMapper = groupDataMapper;
        this.userRepository = userRepository;
        this.userGroupModel = userGroupModel;
        this.userGroupRepository = userGroupRepository;
        this.groupRepository = new GroupRepository(this.model, this.userRepository, this.userGroupModel,
            this.userGroupRepository);
    }

    async create(group: BaseGroup): Promise<Group> {
        const uuid = Utilities.generateUUID();
        const newGroup: Group = {
            id: uuid,
            ...group
        };
        const groupToCreate = this.dataMapper.toDalEntity(newGroup);
        const createdGroup = await this.groupRepository.create(groupToCreate);
        return this.dataMapper.toDomain(createdGroup.toJSON());
    }
    async get(id: string): Promise<Group | undefined> {
        const groupFromDB = await this.groupRepository.get(id);
        return groupFromDB ? this.dataMapper.toDomain(groupFromDB.toJSON()) : undefined;
    }
    async getAll(): Promise<Array<Group | undefined>> {
        const groupsFromDB = await this.groupRepository.getAll();
        return groupsFromDB.map((group: Model<GroupDB> | undefined) => {
            if (group) return this.dataMapper.toDomain(group.toJSON());
        });
    }
    async update(groupUpdates: BaseGroup, id: string): Promise<Group> {
        const groupToUpdate = this.dataMapper.toDalEntity(groupUpdates);
        const updatedGroup = await this.groupRepository.update(groupToUpdate, id);
        return this.dataMapper.toDomain(updatedGroup.toJSON());
    }
    async delete(id: string): Promise<void> {
        return await this.groupRepository.delete(id);
    }
    async addUsersToGroup(groupId: string, userIds: Array<string>, transaction: Transaction): Promise<Group> {
        const groupFromDB = await this.groupRepository.addUsersToGroup(groupId, userIds, transaction);
        return this.dataMapper.toDomain(groupFromDB.toJSON());
    }
}
