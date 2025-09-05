import type { Request, Response } from 'express';
import { createChirp } from '../db/queries/chirps.js';
import { respondWithJSON } from './json.js';
import { BadRequestError } from './classes/statusErrors.js'
import { create } from 'domain';

export const handlerChirps = async (req: Request, res: Response) => {
    type Parameters = {
        body: string;
        userId: string;
    }

    const params: Parameters = req.body;
    const bodyLength = params.body.length;
    const maxChirpLength = 140;
    // const regexFilterWords = ['kerfuffle', 'sharbert', 'fornax'];

    if (bodyLength > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    } else {
        // const dirtyBody: string[] = params.body.split(' ');

        // for (let i = 0; i < dirtyBody.length; i++) {
        //     let lowerCurrentWord = dirtyBody[i].toLowerCase();

        //     if (regexFilterWords.includes(lowerCurrentWord)) {
        //         dirtyBody[i] = '****';
        //     }
        // }

        // const cleanedBody = dirtyBody.join(' ')
        // respondWithJSON(res, 200, { "cleanedBody": cleanedBody })

        if (!params.body || !params.userId) {
            throw new BadRequestError('data does not contain user i')
        }

        createChirp({body: params.body, user_id: params.userId})

        const chirp = await createChirp({body: params.body, user_id: params.userId});

        if (!chirp) throw new Error('Something went wrong creating chirp');

        const { body, id, createdAt, updatedAt, user_id } = chirp;

        respondWithJSON(res, 201, {
            id: id,
            createdAt: createdAt,
            updatedAt: updatedAt,
            body: body,
            userId: user_id
        })
    }
}