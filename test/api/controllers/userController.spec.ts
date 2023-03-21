import sinon from 'sinon';
import { UserController } from '../../../src/api/controllers/userController';
import { UserService } from '../../../src/services/userService';
import { UserModel } from '../../../src/data-access/models/userModel';
import { UserDataMapper } from '../../../src/data-access/mappers/userDataMapper';
import { UserGroupRepository } from '../../../src/data-access/repositories/userGroupRepository';
import { UserGroupModel } from '../../../src/data-access/models/userGroupModel';
import { RequestWithUser } from '../../../src/types/requests';
import { NextFunction, Response } from 'express';
import { EntityNotFoundError } from '../../../src/core/errors/entityNotFoundError';
import { InitializeSequelize } from '../../../src/database/postgreSQL/initializeSequelize';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/core/errors/unauthorizedError';
import { mockRequest, mockResponse, mockNextFn } from '../../data/common/HTTPMocks';
import { mockTransaction } from '../../data/common/DBMocks';
import { mockUsers } from '../../data/userMocks';


describe('User controller tests', () => {
    let mockReq: RequestWithUser;
    let mockRes: Response;
    let mockNext: NextFunction;
    let userService: UserService;
    let userController: UserController;

    beforeEach(() => {
        mockReq = mockRequest();
        mockRes = mockResponse();
        mockNext = mockNextFn();
        userService = new UserService(UserModel, new UserDataMapper(), new UserGroupRepository(UserGroupModel));
        userController = new UserController(userService);
    });
    afterEach(() => {
        jest.clearAllMocks();
        sinon.restore();
    });
    afterAll(() => {
        mockReq = {} as any;
        mockRes = {} as any;
        mockNext = {} as any;
        userService = {} as any;
        userController = {} as any;
    });


    test('createUser method successfully send created user', async () => {
        sinon.stub(userService, 'create').returns(Promise.resolve(mockUsers[0]));
        await userController.createUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers[0]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('createUser method throws error when fail to create user', async () => {
        const error = new Error('create user error');
        sinon.stub(userService, 'create').throws(error);
        await userController.createUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('getUser method successfully send user', async () => {
        mockReq.user = mockUsers[0];
        await userController.getUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers[0]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('getUser method throws error when no user', async () => {
        mockReq.user = undefined;
        await userController.getUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new EntityNotFoundError('User can not be found'));
    });
    test('getUser method throws error when fail to retrieve user', async () => {
        mockReq.user = mockUsers[0];
        const error = new Error('get user error');
        sinon.stub(UserDataMapper, 'toClient').throws(error);
        await userController.getUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('updateUser method successfully send updated user', async () => {
        sinon.stub(userService, 'update').returns(Promise.resolve(mockUsers[1]));
        await userController.updateUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers[1]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('updateUser method throws error when fail to update user', async () => {
        const error = new Error('update user error');
        sinon.stub(userService, 'update').throws(error);
        await userController.updateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('deleteUser method successfully send deleted user', async () => {
        mockReq.user = mockUsers[0];
        sinon.stub(userService, 'delete').returns(Promise.resolve(mockUsers[1]));
        sinon.stub(InitializeSequelize.getInstance(), 'transaction').returns(Promise.resolve(mockTransaction()));
        await userController.deleteUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers[1]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('deleteUser method throws error when fail to delete user', async () => {
        const error = new Error('delete user error');
        mockReq.user = mockUsers[0];
        sinon.stub(userService, 'delete').throws(error);
        sinon.stub(InitializeSequelize.getInstance(), 'transaction').returns(Promise.resolve(mockTransaction()));
        await userController.deleteUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('getAutoSuggestUsers method successfully send auto suggested users', async () => {
        mockReq.query.login = 'testloginG111@gmail.com';
        mockReq.query.limit = '1';
        sinon.stub(userService, 'getAutoSuggestUsers').returns(Promise.resolve([mockUsers[1]]));
        await userController.getAutoSuggestUsers(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([mockUsers[1]]);
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('getAutoSuggestUsers method throws error when no auto suggested users', async () => {
        mockReq.query.login = 'testloginG111@gmail.com';
        mockReq.query.limit = '1';
        sinon.stub(userService, 'getAutoSuggestUsers').returns(Promise.resolve([]));
        await userController.getAutoSuggestUsers(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new EntityNotFoundError('User can not be found'));
    });
    test('getAutoSuggestUsers method throws error when fail to retrieve auto suggested users', async () => {
        mockReq.query.login = 'testloginG111@gmail.com';
        mockReq.query.limit = '1';
        const error = new Error('get auto suggested users error');
        sinon.stub(userService, 'getAutoSuggestUsers').throws(error);
        await userController.getAutoSuggestUsers(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('authenticateUser method successfully send JWT token', async () => {
        sinon.stub(userService, 'getByLoginAndPassword').returns(Promise.resolve(mockUsers[1]));
        sinon.stub(jwt, 'sign').returns('tokenString' as unknown as void);
        await userController.authenticateUser(mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith({ 'token': 'tokenString' });
        expect(mockRes.json).toHaveBeenCalledTimes(1);
    });
    test('authenticateUser method throws error when no user', async () => {
        sinon.stub(userService, 'getByLoginAndPassword').returns(Promise.resolve(undefined));
        await userController.authenticateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('Invalid username or password'));
    });
    test('authenticateUser method throws error when fail to retrieve user', async () => {
        const error = new Error('authenticate user error');
        sinon.stub(userService, 'getByLoginAndPassword').throws(error);
        await userController.authenticateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
