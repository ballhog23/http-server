import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";
import { UserNotAuthenticatedError } from "./classes/statusErrors.js";

export async function handlerWebhook(req: Request, res: Response) {
    type Parameters = {
        event: string,
        data: {
            userId: string,
        },
    };
    
    const apiKey = getAPIKey(req);

    if (apiKey !== config.api.polkaKey) {
        throw new UserNotAuthenticatedError('invalid api key')
    }

    const params: Parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    await upgradeChirpyRed(params.data.userId);

    res.status(204).send();
}