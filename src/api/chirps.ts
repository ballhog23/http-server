import type { Request, Response } from 'express';
import { createChirp } from '../db/queries/chirps.js';
import { respondWithJSON } from './json.js';
import { BadRequestError, UserNotAuthenticatedError, NotFoundError } from './classes/statusErrors.js';
import { getBearerToken } from '../auth.js';
import { validateJWT } from '../auth.js';
import { getAllChirps, getSingleChirp } from '../db/queries/chirps.js'
import { config } from '../config.js';

export const handlerChirps = async (req: Request, res: Response) => {
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

export async function handlerGetAllChirps(_: Request, res: Response) {
    const allChirps = await getAllChirps();
    respondWithJSON(res, 200, allChirps)
}

export async function handlerGetSingleChirp(req: Request, res: Response) {
    const { chirpID } = req.params;
    const chirp = await getSingleChirp(chirpID)

    if (!chirp) throw new NotFoundError(`Chirp with id: ${chirpID} was not found`)

    respondWithJSON(res, 200, chirp)
}