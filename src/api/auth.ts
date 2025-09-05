import { Response, Request } from "express";
import { UserNotAuthenticatedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import type { UserResponse } from '../api/users.js';

export async function loginHandler(req: Request, res: Response) {
    type Parameters = {
        password: string,
        email: string,
    }

    const params: Parameters = req.body;

    const user = await getUserByEmail(params.email);

    if (!user) throw new UserNotAuthenticatedError('Incorrect email or password');

    const matching = await checkPasswordHash(params.password, user.hashedPassword);

    if (!matching) throw new UserNotAuthenticatedError('Incorrect email or password');

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    } satisfies UserResponse)
}