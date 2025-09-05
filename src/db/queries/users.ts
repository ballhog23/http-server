import { db } from '../index.js';
import { eq } from "drizzle-orm";
import { NewUser, users } from '../schema.js';

export type UserResponse = Omit<NewUser, 'hashed_password'>

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
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) return;
    return user[0];
}

// export async function getHashedPassword() {
//     const row = await db
//         .select({
//             hashed_password: users.hashed_password
//         })
//         .from(users)

//         if (row.length === 0) return;

//     return row[0];
// }