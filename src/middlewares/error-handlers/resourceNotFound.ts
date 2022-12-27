import { Request, Response } from 'express';


class ResourceNotFound {
    notFoundHandler(req: Request, res: Response) {
        res.status(404)
            .json({ message: 'Requested resource not found' });
    }
}

export { ResourceNotFound };
