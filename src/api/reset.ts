import { Request, Response } from "express";
import { deleteAllUsers } from "../db/queries/users.js";
import { deleteAllChirps, deleteNullChirps } from "../db/queries/chirps.js";
import { config } from '../config.js';
import { ForbiddenError } from "./classes/statusErrors.js";
process.loadEnvFile();


export const resetHandler = async (req: Request, res: Response) => {
    if (process.env.PLATFORM !== 'dev') {
        console.log('current platform: ', config.api.platform);
        throw new ForbiddenError("Reset is only allowed in dev environment.");
    }
    
    config.api.fileServerHits = 0;
    await deleteAllUsers();
    await deleteNullChirps();
    res.write("Hits reset to 0");
    res.end();
}