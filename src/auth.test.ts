import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";
import { hashPassword, checkPasswordHash } from "./auth.js";
import { UserNotAuthenticatedError } from "./api/classes/statusErrors";
import { config } from './config.js';

// describe("Password Hashing", () => {
//   const password1 = "correctPassword123!";
//   const password2 = "anotherPassword456!";
//   let hash1: string;
//   let hash2: string;

//   beforeAll(async () => {
//     hash1 = await hashPassword(password1);
//     hash2 = await hashPassword(password2);
//   });

//   it("should return true for the correct password", async () => {
//     const result = await checkPasswordHash(password1, hash1);
//     expect(result).toBe(true);
//   });
// });

describe("JWT verification", () => {
    const secret = 'shhhh';
    const wrongSecret = 'ahhhh';
    const userID = 'user-123'
    let validToken: string;

    beforeAll(async () => {
        validToken = makeJWT(userID, 3600, secret)
    })

    it("should validate a valid token", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });

    it("should throw an error for an invalid token string", () => {
        expect(() => validateJWT('wrongtokenkey', secret)).toThrow(UserNotAuthenticatedError)
    })

    it("should throw an error for an invalid secret", () => {
        expect(() => validateJWT(validToken, wrongSecret)).toThrow(UserNotAuthenticatedError)
    })
});

describe('Bearer Token', () => {
    const secret = config.secret;
    let token: string | undefined;
    let wrongToken: string | undefined;;
    const stub = {
        getBearerToken: (name: string | undefined) => {
            if (name === 'Authorization') {
                const length = 'Bearer'.length + 1;
                const value = 'Bearer sdfds82h';
                const key = value.slice(length)
                return key;
            }

            return undefined;
        }
    }

    beforeAll(async () => {
        token = stub.getBearerToken('Authorization');
        wrongToken = stub.getBearerToken('Farty')
    })

    it('should return the bearer token', () => {
        expect(token).toBe('sdfds82h')
    })

    it('should return undefined if no Authorization header is present on http request', () => {
        expect(wrongToken).toBe(undefined)
    })
})