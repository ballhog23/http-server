import type { Request, Response } from 'express';
import { config } from '../config.js';

export const metricsHandler = async (_: Request, res: Response) => {
    res.send(`Hits: ${config.fileServerHits}`);
}