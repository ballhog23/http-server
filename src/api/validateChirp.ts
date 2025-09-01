import type { Request, Response } from 'express';
import { respondWithJSON, respondWithError } from './json.js';


export const handlerValidateChirp = async (req: Request, res: Response) => {
    type Parameters = {
        body: string
    }

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
        console.log(`Received ${chunk.length} bytes of data.`);
    })

    let params: Parameters;

    req.on('end', () => {
        try {
            params = JSON.parse(body);
        } catch (error) {
            respondWithError(res, 400, 'Invalid JSON');
            return;
        }

        const maxChirpChars = 140;

        if (params.body.length > maxChirpChars) {
            respondWithError(res, 400, 'Chirp is too long');
            return;
        }

        respondWithJSON(res, 200, { valid: true })
    })
}