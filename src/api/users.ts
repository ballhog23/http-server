import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";
import type { UserResponse } from "../db/queries/users.js";

export async function userHandler(req: Request, res: Response) {
    type Parameters = {
        email: string;
        password: string;
    }

    const params: Parameters = req.body;

    if (!params.email || !params.password) throw new BadRequestError('Missing required fields')

    params.password = await hashPassword(params.password);

    const user = await createUser({email: params.email, hashed_password: params.password});

    if (!user) throw new Error('Unable to create user');

    const {id, createdAt, updatedAt, email} = user;
    
    const userResponse: UserResponse = {id: id, createdAt: createdAt, updatedAt: updatedAt, email: email};

    respondWithJSON(res, 201, userResponse)
}