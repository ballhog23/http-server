import { Request, Response } from "express";
import { createUser, getUserById, updateUserEmailAndPassword, upgradeUserToPremium } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./classes/statusErrors.js";
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

export async function updateEmailAndPasswordHandler(req: Request, res: Response) {
    type Parameters = {
        email: string;
        password: string;
    };

    const accessToken = getBearerToken(req);

    const params: Parameters = req.body;

    if (!params.email || !params.password) throw new BadRequestError('Missing required fields');

    const userId = validateJWT(accessToken, config.jwt.secret);

    if (!userId) throw new UserNotAuthenticatedError('not authorized');

    const hashedPassword = await hashPassword(params.password);
    const updatedEmail = params.email;
    // get user from id
    const user = await getUserById(userId);
    user.hashedPassword = hashedPassword;
    user.email = updatedEmail;

    // update user
    const updatedUser = await updateUserEmailAndPassword(user);

    respondWithJSON(res, 200, updatedUser satisfies UserResponse)
}

export async function upgradeToChirpyRedHandler(req: Request, res: Response) {
    type Parameters = {
        event: string,
        data: {
            userId: string,
        },
    };

    // const accessToken = getBearerToken(req);
    // const userId = validateJWT(accessToken, config.jwt.secret);

    // if (!userId) throw new UserNotAuthenticatedError('invalid token');

    const params: Parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
    }

    if (params.event === 'user.upgraded') {
        const user = await upgradeUserToPremium(params.data.userId)

        if (!user) {
            throw new NotFoundError('user not found');
        }

        res.status(204).send();
    }
}