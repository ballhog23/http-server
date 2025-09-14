import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js";

export async function handlerWebhook(req: Request, res: Response) {
    type Parameters = {
        event: string,
        data: {
            userId: string,
        },
    };

    const params: Parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    await upgradeChirpyRed(params.data.userId);

    res.status(204).send();
}