import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";
import type { NewUser } from "../db/schema.js";

export type UserResponse = Omit<NewUser, 'hashed_password'>

export async function userHandler(req: Request, res: Response) {
    type Parameters = {
        email: string;
        password: string;
    }

    const params: Parameters = req.body;

    if (!params.email || !params.password) throw new BadRequestError('Missing required fields')

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({
        email: params.email,
        hashedPassword
    } satisfies NewUser);

    if (!user) throw new Error('Unable to create user');

    const { id, createdAt, updatedAt, email } = user;

    const userResponse: UserResponse = { id: id, createdAt: createdAt, updatedAt: updatedAt, email: email };

    respondWithJSON(res, 201, userResponse)
}