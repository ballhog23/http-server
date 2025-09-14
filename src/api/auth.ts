import { Response, Request } from "express";
import { UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { userForRefreshToken, saveUserRefreshToken, revokeUserRefreshToken } from '../db/queries/refresh.js';
import type { UserResponse } from '../api/users.js';
import { config } from '../config.js';

export type LoginResponse = UserResponse & {
    token: string;
    refreshToken: string;
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
    const saved = await saveUserRefreshToken(user.id, refreshToken);

    if (!saved) throw new UserNotAuthenticatedError('could not save refresh token');

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
        token: accessToken,
        refreshToken: refreshToken,
    } satisfies LoginResponse)
}

export async function refreshHandler(req: Request, res: Response) {
    let refreshToken = getBearerToken(req);

    const result = await userForRefreshToken(refreshToken);
    if (!result) throw new UserNotAuthenticatedError('invalid refresh token');

    const user = result.user;
    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    type TokenResponse = {
        token: string;
    }

    respondWithJSON(res, 200, { token: accessToken } satisfies TokenResponse);
}

export async function revokeHandler(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeUserRefreshToken(refreshToken);
    res.status(204).send();
}