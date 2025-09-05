import { db } from "../index.js";
import { Chirp, chirps } from '../schema.js';

export async function createChirp({ body, user_id }: Chirp) {

    const [result] = await db
        .insert(chirps)
        .values({body: body, user_id: user_id})
        .onConflictDoNothing()
        .returning()

    return result;
}