import { Request, Response } from "express";
import { deleteAllUsers } from "../db/queries/users.js";
import { config } from '../config.js';
import { UserForbiddenError } from "./classes/statusErrors.js";
process.loadEnvFile();


export const resetHandler = async (req: Request, res: Response) => {
    if (process.env.PLATFORM !== 'dev') {
        console.log('current platform: ', config.api.platform);
        throw new UserForbiddenError("Reset is only allowed in dev environment.");
    }
    
    config.api.fileServerHits = 0;
    await deleteAllUsers();
    res.write("Hits reset to 0");
    res.end();
}