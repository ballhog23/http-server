import { Response, Request } from "express";
import { UnauthorizedError } from "./classes/statusErrors.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash } from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import type { UserResponse } from '../db/queries/users.js'

export async function loginHandler(req: Request, res: Response) {
    type Parameters = {
        password: string,
        email: string,
    }

    const params: Parameters = req.body;

    const user = await getUserByEmail(params.email);

    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const { hashed_password } = user;

    const hashedPassword = await checkPasswordHash(params.password, hashed_password);

    if (!hashedPassword) throw new UnauthorizedError('Incorrect email or password');

    const { id, createdAt, updatedAt, email } = user;

    respondWithJSON(res, 200, {
        id: id,
        createdAt: createdAt,
        updatedAt: updatedAt,
        email: email
    } satisfies UserResponse)

}