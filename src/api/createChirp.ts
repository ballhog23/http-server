import type { Request, Response } from 'express';
import { createChirp } from '../db/queries/chirps.js';
import { respondWithJSON } from './json.js';
import { BadRequestError } from './classes/statusErrors.js'

export const handlerChirps = async (req: Request, res: Response) => {
    type Parameters = {
        body: string;
        userId: string;
    }

    const params: Parameters = req.body;

    if (!params.body || !params.userId) {
        throw new BadRequestError('data does not contain user info or req body')
    }

    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({ body: cleanedBody, userId: params.userId });

    if (!chirp) throw new Error('Something went wrong creating chirp');

    const { body, id, createdAt, updatedAt, userId } = chirp;

    respondWithJSON(res, 201, {
        id: id,
        createdAt: createdAt,
        updatedAt: updatedAt,
        body: body,
        userId: userId
    })

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