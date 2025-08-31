import { config } from '../config.js';
export const middlewareFileServerHits = (req, __, next) => {
    console.log('requesting URL: ', req.url);
    config.fileServerHits++;
    next();
};
