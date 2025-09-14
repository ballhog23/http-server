import { Request, Response } from "express";
import { createUser, updateUserEmailAndPassword } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import type { NewUser } from "../db/schema.js";
import { config } from '../config.js';

export type UserResponse = Omit<NewUser, 'hashed_password'>;

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

    const { id, createdAt, updatedAt, email, isChirpyRed } = user;

    const userResponse = {
        id: id,
        createdAt: createdAt,
        updatedAt: updatedAt,
        email: email,
        isChirpyRed: isChirpyRed,
    } satisfies UserResponse;

    respondWithJSON(res, 201, userResponse)
}

export async function handlerUsersUpdate(req: Request, res: Response) {
    type Parameters = {
        email: string;
        password: string;
    };

    const accessToken = getBearerToken(req);
    const userId = validateJWT(accessToken, config.jwt.secret);

    const params: Parameters = req.body;

    if (!params.email || !params.password) throw new BadRequestError('Missing required fields');

    if (!userId) throw new UserNotAuthenticatedError('not authorized');

    // update user
    const hashedPassword = await hashPassword(params.password);
    const updatedEmail = params.email
    const user = await updateUserEmailAndPassword(userId, updatedEmail, hashedPassword);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    } satisfies UserResponse)
}