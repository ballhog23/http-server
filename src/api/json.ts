import type { Response } from "express";

export const respondWithJSON = async (res: Response, statusCode: number, payload: any) => {
    res.set('Content-Type', 'application/json');
    const body = JSON.stringify(payload);
    res.status(statusCode).send(body);
}

export const respondWithError = async (res: Response, statusCode: number, message: string) => {
    respondWithJSON(res, statusCode, { error: message })
}


