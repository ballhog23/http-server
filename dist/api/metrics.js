import { config } from '../config.js';
export const metricsHandler = async (_, res) => {
    res.send(`Hits: ${config.fileServerHits}`);
};
