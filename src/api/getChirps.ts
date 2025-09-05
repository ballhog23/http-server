import { Request, Response } from "express";
import { getAllChirps } from '../db/queries/chirps.js'
import { respondWithJSON } from './json.js';

export async function handlerGetAllChirps(_: Request, res: Response) {
    const allChirps = await getAllChirps();
    respondWithJSON(res, 200, allChirps)
}