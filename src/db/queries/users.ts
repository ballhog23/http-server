import { db } from '../index.js';
import { eq } from "drizzle-orm";
import { NewUser, users } from '../schema.js';

export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning()

    return result;
}

export async function deleteAllUsers() {
    await db.delete(users);
}

export async function getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}

export async function getUserById(userId: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    return user;
}

export async function updateUserEmailAndPassword(user: NewUser) {
    const [result] = await db
        .update(users)
        .set({ email: user.email, hashedPassword: user.hashedPassword })
        .returning({ id: users.id, email: users.email, createdAt: users.createdAt, updatedAt: users.updatedAt });

    return result;
}

export async function upgradeUserToPremium(userId: string) {
    const [result] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, userId))
        .returning({id: users.id})

    return result;
}