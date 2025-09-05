import { Request, Response } from "express";
import { getAllChirps } from '../db/queries/chirps.js'
import { respondWithJSON } from './json.js';
import { BadRequestError } from './classes/statusErrors.js'

export async function handlerGetAllChirps(_: Request, res: Response) {
    const allChirps = await getAllChirps();

    if (!allChirps) throw new BadRequestError('something went wrong with the request');

    respondWithJSON(res, 200, allChirps)
}