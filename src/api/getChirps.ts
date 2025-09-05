import { Request, Response } from "express";
import { getAllChirps, getSingleChirp } from '../db/queries/chirps.js'
import { respondWithJSON } from './json.js';
import { NotFoundError } from "./classes/statusErrors.js";

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