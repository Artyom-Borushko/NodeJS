import { Request, Response } from 'express';


export class ResourceNotFoundHandler {
    notFoundHandler(req: Request, res: Response) {
        res.status(404)
            .json({ message: 'Requested resource not found' });
    }
}
