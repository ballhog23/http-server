import { db } from '../index.js';
import { eq } from 'drizzle-orm';
import { sql } from "drizzle-orm";
import { RefreshToken, refreshTokens, } from '../schema.js';

export async function insertUserRefreshToken(refreshToken: RefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning()

    return result;
}

export async function getUserByRefreshToken(refreshToken: string) {
    const [user] = await db
        .select({ expiresAt: refreshTokens.expiresAt, revokedAt: refreshTokens.revokedAt, userId: refreshTokens.userId })
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken))

    return user;
}

export async function revokeUserRefreshToken(refreshToken: string) {
    const [result] = await db
        .update(refreshTokens)
        .set({ revokedAt: sql`'now()'`, updatedAt: sql`'now()'` })
        .where(eq(refreshTokens.token, refreshToken))
        .returning({ updatedAt: refreshTokens.updatedAt })
        
    return result;
}