import { Request, Response } from "express";
import { config } from '../config.js';

export const resetHandler = async (req: Request, res: Response) => {
    config.api.fileServerHits = 0;
    res.send()
}