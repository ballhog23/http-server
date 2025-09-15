import type { Request, Response } from 'express';
import { createChirp, deleteSingleChirp } from '../db/queries/chirps.js';
import { respondWithJSON } from './json.js';
import { BadRequestError, NotFoundError, UserForbiddenError } from './classes/statusErrors.js';
import { getBearerToken, validateJWT } from '../auth.js';
import { getAllChirps, getSingleChirp, getAllChirpsByAuthor } from '../db/queries/chirps.js'
import { config } from '../config.js';
import { param } from 'drizzle-orm';

export async function handlerChirps(req: Request, res: Response) {
    type Parameters = {
        body: string;
    }

    const params: Parameters = req.body;
    const bearerToken = getBearerToken(req);
    const userId = validateJWT(bearerToken, config.jwt.secret);

    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ body: cleanedBody, userId: userId });

    respondWithJSON(res, 201, chirp)
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const theChirp = await getSingleChirp(chirpId);

    if (!theChirp) {
        throw new NotFoundError('chirp not found')
    }

    const userAuthorized = theChirp.userId === userId;
    if (!userAuthorized) {
        throw new UserForbiddenError("You can't delete this chirp");
    }

    const deleted = await deleteSingleChirp(chirpId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }

    res.status(204).send()
}

function validateChirp(body: string) {
    const bodyLength = body.length;
    const maxChirpLength = 140;

    if (bodyLength > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    const filterWords = ['kerfuffle', 'sharbert', 'fornax'];
    return getCleanedBody(body, filterWords)
}

function getCleanedBody(body: string, filterWords: string[]) {
    const words = body.split(' ');

    for (let i = 0; i < words.length; i++) {
        let lowerCurrentWord = body[i].toLowerCase();

        if (filterWords.includes(lowerCurrentWord)) {
            words[i] = '****';
        }
    }

    const cleanedBody = words.join(' ');
    return cleanedBody;
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    type ReqQuery = {
        authorId?: string,
    }
    
    const query: ReqQuery = req.query;

    if (!query.authorId) {
        const allChirps = await getAllChirps();
        respondWithJSON(res, 200, allChirps);

    } else {
        const authorId = query.authorId;
        const allAuthorChirps = await getAllChirpsByAuthor(authorId);
        respondWithJSON(res, 200, allAuthorChirps);
    }

}

export async function handlerGetSingleChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
    const chirp = await getSingleChirp(chirpId)

    if (!chirp) throw new NotFoundError(`Chirp with id: ${chirpId} was not found`)

    respondWithJSON(res, 200, chirp)
}