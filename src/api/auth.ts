import { Response, Request } from "express";
import { BadRequestError, UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import type { UserResponse } from '../api/users.js';
import { config } from '../config.js';

export type LoginResponse = UserResponse & {
    token: string;
}

export async function loginHandler(req: Request, res: Response) {
    type Parameters = {
        password: string,
        email: string,
        expiresIn?: number,
    }

    const params: Parameters = req.body;

    const user = await getUserByEmail(params.email);

    if (!user) throw new UserNotAuthenticatedError('Invalid email or password');

    const matching = await checkPasswordHash(params.password, user.hashedPassword);

    if (!matching) throw new UserNotAuthenticatedError('Invalid email or password');

    let duration = config.jwt.defaultDuration;
    if (params.expiresIn !== undefined && params.expiresIn <= config.jwt.defaultDuration) {
        duration = params.expiresIn;
    }

    const accessToken = makeJWT(user.id, duration, config.jwt.secret);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: accessToken
    } satisfies LoginResponse)
}