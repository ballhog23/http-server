import { isNull } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from '../schema.js';

export async function createChirp(chirp: Chirp) {

    const [rows] = await db
        .insert(chirps)
        .values(chirp)
        .returning()

    return rows;
}

// export async function deleteAllChirps() {
//     await db.delete(chirps);
// }

// export async function deleteNullChirps() {
//     await db.delete(chirps).where(isNull(chirps.user_id))
// }