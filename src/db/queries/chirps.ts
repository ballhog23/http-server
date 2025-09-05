// import { isNull } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from '../schema.js';

export async function createChirp(chirp: NewChirp) {

    const [rows] = await db
        .insert(chirps)
        .values(chirp)
        .returning()

    return rows;
}

export async function getAllChirps() {
    const rows = await db
        .select()
        .from(chirps)
        .orderBy(chirps.createdAt) // asc unless otherwise specified

    return rows;
}

// export async function deleteAllChirps() {
//     await db.delete(chirps);
// }

// export async function deleteNullChirps() {
//     await db.delete(chirps).where(isNull(chirps.user_id))
// }