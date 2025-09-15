import { and, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps, users } from '../schema.js';

export async function createChirp(chirp: NewChirp) {

    const [rows] = await db
        .insert(chirps)
        .values(chirp)
        .returning()

    return rows;
}

export async function getAllChirps() {
    return db.select().from(chirps).orderBy(chirps.createdAt);
}

export async function getAllChirpsByAuthor(userId: string) {
    const rows = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId));

    return rows;
}

export async function getSingleChirp(id: string) {
    const rows = await db.select().from(chirps).where(eq(chirps.id, id));
    if (rows.length === 0) {
        return;
    }
    return rows[0];
}

export async function deleteSingleChirp(chirpId: string) {
    const rows = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning()

    return rows.length > 0;
}

// export async function deleteAllChirps() {
//     await db.delete(chirps);
// }

// export async function deleteNullChirps() {
//     await db.delete(chirps).where(isNull(chirps.user_id))
// }