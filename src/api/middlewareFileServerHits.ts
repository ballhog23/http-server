import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export const middlewareFileServerHits = (req: Request, __: Response, next: NextFunction) => {
    console.log('requesting URL: ', req.url)
    config.api.fileServerHits++;
    next();
}