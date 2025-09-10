import { Response, Request } from "express";
import { BadRequestError, UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { getUserByRefreshToken, insertUserRefreshToken, revokeUserRefreshToken } from '../db/queries/refreshTokens.js';
import type { UserResponse } from '../api/users.js';
import { config } from '../config.js';

export type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
}

export type TokenResponse = {
    token: string;
}

export async function loginHandler(req: Request, res: Response) {
    type Parameters = {
        password: string,
        email: string,
    };

    const params: Parameters = req.body;

    const user = await getUserByEmail(params.email);

    if (!user) throw new UserNotAuthenticatedError('Invalid email or password');

    const matching = await checkPasswordHash(params.password, user.hashedPassword);

    if (!matching) throw new UserNotAuthenticatedError('Invalid email or password');

    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
    const refreshToken = makeRefreshToken();
    insertUserRefreshToken({ token: refreshToken, userId: user.id });


    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse)
}

export async function refreshHandler(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const user = await getUserByRefreshToken(refreshToken);
    const now = new Date();
    console.log('queried user by refresh token:\n',user)

    if (user.revokedAt !== null || now > user.expiresAt) {
        respondWithError(res, 401, 'not authenticated');
        return;
    }

    const accessToken = makeJWT(user.userId, config.jwt.defaultDuration, config.jwt.secret);

    respondWithJSON(res, 200, { token: accessToken } satisfies TokenResponse);
}

export async function revokeHandler(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeUserRefreshToken(refreshToken);
    respondWithJSON(res, 204, null)
}