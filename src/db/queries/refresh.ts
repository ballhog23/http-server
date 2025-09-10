import { db } from '../index.js';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { refreshTokens, users } from '../schema.js';
import { config } from '../../config.js';

export async function saveUserRefreshToken(userID: string, token: string) {
    const rows = await db
        .insert(refreshTokens)
        .values({
            userId: userID,
            token: token,
            expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
            revokedAt: null,
        })
        .onConflictDoNothing()
        .returning();

    return rows.length > 0;
}

export async function userForRefreshToken(token: string) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(
            and(
                eq(refreshTokens.token, token),
                isNull(refreshTokens.revokedAt),
                gt(refreshTokens.expiresAt, new Date())
            )
        )
        .limit(1);

    return result;
}

export async function revokeUserRefreshToken(token: string) {
    const rows = await db
        .update(refreshTokens)
        .set({ expiresAt: new Date() })
        .where(eq(refreshTokens.token, token))
        .returning();

    if (rows.length === 0) throw new Error("Couldn't revoke token")

    return rows;
}