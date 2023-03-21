import { RequestWithGroup } from '../../../src/types/requests';
import { NextFunction, Response } from 'express';

export function mockRequest() {
    const req = {} as RequestWithGroup;
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req) as any;
    req.query = jest.fn().mockReturnValue(req) as any;
    return req;
}
export function mockResponse() {
    const res = {} as Response;
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
}
export function mockNextFn() {
    const next = jest.fn().mockReturnValue('NEXT');
    return next as NextFunction;
}
