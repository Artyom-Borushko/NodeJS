import sinon from 'sinon';
import { RequestWithGroup } from '../../../src/types/requests';
import { NextFunction, Response } from 'express';
import { Group } from '../../../src/types/group';
import { UserModel } from '../../../src/data-access/models/userModel';
import { UserGroupRepository } from '../../../src/data-access/repositories/userGroupRepository';
import { UserGroupModel } from '../../../src/data-access/models/userGroupModel';
import { GroupService } from '../../../src/services/groupService';
import { GroupModel } from '../../../src/data-access/models/groupModel';
import { GroupDataMapper } from '../../../src/data-access/mappers/groupDataMapper';
import { UserRepository } from '../../../src/data-access/repositories/userRepository';
import { GroupController } from '../../../src/api/controllers/groupController';
import { EntityNotFoundError } from '../../../src/core/errors/entityNotFoundError';
import { InitializeSequelize } from '../../../src/database/postgreSQL/initializeSequelize';

describe('Group controller tests', () => {
    let mockReq: RequestWithGroup;
    let mockRes: Response;
    let mockNext: NextFunction;
    let userGroupRepository: UserGroupRepository;
    let groupService: GroupService;
    let groupController: GroupController;
    const mockGroups: Array<Group> = [
        {
            id: '887bfcb7-87c6-40d2-a882-5bb8580d783b',
            name: 'testgroupname5',
            permissions: [
                'READ',
                'UPLOAD_FILES'
            ]
        },
        {
            id: 'f5f6ecaa-3208-4df7-b49b-710bc82d9e79',
            name: 'testgroupname',
            permissions: [
                'READ',
                'DELETE'
            ]
        }
    ];

    function mockRequest() {
        const req = {} as RequestWithGroup;
        req.body = jest.fn().mockReturnValue(req);
        req.params = jest.fn().mockReturnValue(req) as any;
        req.query = jest.fn().mockReturnValue(req) as any;
        return req;
    }
    function mockResponse() {
        const res = {} as Response;
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        return res;
    }
    function mockNextFn() {
        const next = jest.fn().mockReturnValue('NEXT');
        return next as NextFunction;
    }
    function mockTransaction() {
        const transactionObj = {} as any;
        transactionObj.commit = jest.fn().mockReturnValue('commit');
        transactionObj.transaction = jest.fn().mockReturnValue('transaction');
        transactionObj.rollback = jest.fn().mockReturnValue('rollback');
        return transactionObj;
    }

    beforeEach(() => {
        mockReq = mockRequest();
        mockRes = mockResponse();
        mockNext = mockNextFn();
        userGroupRepository = new UserGroupRepository(UserGroupModel);
        groupService = new GroupService(GroupModel, new GroupDataMapper(),
            new UserRepository(UserModel, userGroupRepository), UserGroupModel,
            userGroupRepository);
        groupController = new GroupController(groupService);
    });
    afterEach(() => {
        jest.clearAllMocks();
        sinon.restore();
    });
    afterAll(() => {
        mockReq = {} as any;
        mockRes = {} as any;
        mockNext = {} as any;
        userGroupRepository = {} as any;
        groupService = {} as any;
        groupController = {} as any;
    });


    test('createGroup method successfully send created group', async () => {
        sinon.stub(groupService, 'create').returns(Promise.resolve(mockGroups[0]));
        await groupController.createGroup(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups[0]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('createGroup method throws error when fail to create group', async () => {
        const error = new Error('create group error');
        sinon.stub(groupService, 'create').throws(error);
        await groupController.createGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('getGroup method successfully send group', async () => {
        mockReq.group = mockGroups[0];
        await groupController.getGroup(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups[0]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('getGroup method throws error when no group', async () => {
        mockReq.group = undefined;
        await groupController.getGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new EntityNotFoundError('Group can not be found'));
    });
    test('getGroup method throws error when fail to send response with group', async () => {
        mockReq.group = mockGroups[0];
        const error = new Error('get group error');
        sinon.stub(groupController, 'success').throws(error);
        await groupController.getGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('updateGroup method successfully send updated group', async () => {
        sinon.stub(groupService, 'update').returns(Promise.resolve(mockGroups[1]));
        await groupController.updateGroup(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups[1]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('updateGroup method throws error when fail to update group', async () => {
        const error = new Error('update group error');
        sinon.stub(groupService, 'update').throws(error);
        await groupController.updateGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('deleteGroup method successfully send deleted group', async () => {
        mockReq.group = mockGroups[1];
        sinon.stub(groupService, 'delete').returns(Promise.resolve());
        await groupController.deleteGroup(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups[1]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('deleteGroup method throws error when fail to delete group', async () => {
        const error = new Error('delete group error');
        mockReq.group = mockGroups[0];
        sinon.stub(groupService, 'delete').throws(error);
        await groupController.deleteGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('addUsersToGroup method successfully send group for added users', async () => {
        sinon.stub(groupService, 'addUsersToGroup').returns(Promise.resolve(mockGroups[1]));
        sinon.stub(InitializeSequelize.getInstance(), 'transaction').returns(Promise.resolve(mockTransaction()));
        await groupController.addUsersToGroup(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockGroups[1]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('addUsersToGroup method throws error when fail to add users to group', async () => {
        const error = new Error('add users to group error');
        sinon.stub(groupService, 'addUsersToGroup').throws(error);
        sinon.stub(InitializeSequelize.getInstance(), 'transaction').returns(Promise.resolve(mockTransaction()));
        await groupController.addUsersToGroup(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('getAllGroups method successfully send all groups', async () => {
        sinon.stub(groupService, 'getAll').returns(Promise.resolve(mockGroups));
        await groupController.getAllGroups(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                groups: mockGroups
            }
        });
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('getAllGroups method throws error when fail to get all groups', async () => {
        const error = new Error('get all groups error');
        sinon.stub(groupService, 'getAll').throws(error);
        await groupController.getAllGroups(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
