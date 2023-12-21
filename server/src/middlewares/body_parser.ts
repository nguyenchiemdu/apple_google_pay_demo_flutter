import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

export const bodyParserMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.originalUrl === '/webhook') {
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
}
