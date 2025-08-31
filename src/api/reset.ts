import { Request, Response } from "express";
import { config } from '../config.js';

export const resetHandler = async (req: Request, res: Response) => {
    config.fileServerHits = 0;
    res.send()
}