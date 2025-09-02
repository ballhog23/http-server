import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { BadRequestError } from './classes/statusErrors.js'

export const handlerValidateChirp = async (req: Request, res: Response) => {
    type Parameters = {
        body: string;
    }

    const params: Parameters = req.body;
    const bodyLength = params.body.length;
    const maxChirpLength = 140;
    const regexFilterWords = ['kerfuffle', 'sharbert', 'fornax'];

    if (bodyLength > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    } else {
        const dirtyBody: string[] = params.body.split(' ');

        for (let i = 0; i < dirtyBody.length; i++) {
            let lowerCurrentWord = dirtyBody[i].toLowerCase();

            if (regexFilterWords.includes(lowerCurrentWord)) {
                dirtyBody[i] = '****';
            }
        }

        const cleanedBody = dirtyBody.join(' ')
        respondWithJSON(res, 200, { "cleanedBody": cleanedBody })
    }
}