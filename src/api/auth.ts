import { Response, Request } from "express";
import { BadRequestError, UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import type { UserResponseWithJwt } from '../api/users.js';
import { config } from '../config.js';

export async function loginHandler(req: Request, res: Response) {
    type Parameters = {
        password: string,
        email: string,
        expiresInSeconds?: number,
    }

    const params: Parameters = req.body;

    const user = await getUserByEmail(params.email);

    if (!user) throw new UserNotAuthenticatedError('Incorrect email or password');

    const matching = await checkPasswordHash(params.password, user.hashedPassword);

    if (!matching) throw new UserNotAuthenticatedError('Incorrect email or password');

    const jwtExpiresAt = params.expiresInSeconds && params.expiresInSeconds <= 3600 ? params.expiresInSeconds : 3600;
    const jwt = makeJWT(user.id, jwtExpiresAt, config.secret);

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: jwt
    } satisfies UserResponseWithJwt)
}

export async function getBearerToken(req: Request) {
    const bearerToken = req.get('Authorization');

    if (bearerToken === undefined) throw new BadRequestError('no authorization header')

    const tokenString = bearerToken.trim().slice('Bearer'.length + 1)

    return tokenString;
}