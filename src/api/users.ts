import { Request, Response } from "express";
import { createUser, getUserById, updateUserEmailAndPassword } from "../db/queries/users.js";
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

    const { id, createdAt, updatedAt, email } = user;

    const userResponse: UserResponse = { id: id, createdAt: createdAt, updatedAt: updatedAt, email: email };

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

    console.log(userId)

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