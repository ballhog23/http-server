import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";

export async function insertUserHandler(req: Request, res: Response) {
    type Parameters = {
        email: string;
    }

    const params: Parameters = req.body;

    if (!params.email) throw new BadRequestError('Missing required fields')

    const user = await createUser({email: params.email});

    if (!user) throw new Error('Unable to create user')

    respondWithJSON(res, 201, { ...user })
}