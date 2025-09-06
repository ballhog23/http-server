import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";
import { hashPassword, checkPasswordHash } from "./auth.js";
import { BadRequestError, UserNotAuthenticatedError } from "./api/classes/statusErrors";
import { extractBearerToken } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

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

describe('Extract Bearer Token', () => {
    it('should extract the token from a valid header', () => {
        const token = 'a1b2c3';
        const header = `Bearer ${token}`;
        expect(extractBearerToken(header)).toBe(token);
    })

    it('should extract the token even if there are extra parts', () => {
        const token = 'a1b2c3';
        const header = `Bearer ${token} this is some extra stuff`;
        expect(extractBearerToken(header)).toBe(token);
    })

    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = 'Bearer';
        expect(() => extractBearerToken(header)).toThrow(BadRequestError)
    })

    it('should throw a BadRequestError if the header does not start with "Bearer"', () => {
        const header = 'Butterfinger mySecretKey';
        expect(() => extractBearerToken(header)).toThrow(BadRequestError)
    })

    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractBearerToken(header)).toThrow(BadRequestError);
    });
})