import type { NextFunction, Request, Response } from 'express';
import { respondWithError } from './json.js';
import { BadRequestError, UserForbiddenError, UserNotAuthenticatedError, NotFoundError } from './classes/statusErrors.js'

export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;

    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;

    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;

    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message)
    }

    respondWithError(res, statusCode, message)
}