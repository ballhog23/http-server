import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UserNotAuthenticatedError } from "./api/classes/statusErrors.js";
import { Request } from "express";

const TOKEN_ISSUER = 'chirpy';

export async function hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;

    const token = jwt.sign({
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt
    } satisfies Payload,
        secret,
        { algorithm: 'HS256' }
    );

    return token;
}

export function validateJWT(tokenString: string, secret: string) {
    let decoded: Payload;

    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new UserNotAuthenticatedError('Invalid Token');
    }

    if (decoded.iss !== TOKEN_ISSUER) throw new UserNotAuthenticatedError('Invalid Issuer');

    if (!decoded.sub) throw new UserNotAuthenticatedError('No user ID in token')

    return decoded.sub;
}

export function getBearerToken(req: Request) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        throw new UserNotAuthenticatedError("malformed authorization header")
    }

    return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
    const splitAuth = header.split(' ');

    if (splitAuth.length < 2 || splitAuth[0] !== 'Bearer') {
        throw new BadRequestError('malformed authorization header')
    }

    return splitAuth[1];
}

export function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function getAPIKey(req: Request) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        throw new UserNotAuthenticatedError('malformed authorization header');
    }

    return extractAPIKey(authHeader);
}

export function extractAPIKey(header: string) {
    const splitAuth = header.split(' ');

    if (splitAuth.length < 2 || splitAuth[0] !== 'ApiKey') {
        throw new BadRequestError('malformed authorization header')
    }

    return splitAuth[1];
}