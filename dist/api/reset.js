import { config } from '../config.js';
export const resetHandler = async (req, res) => {
    config.fileServerHits = 0;
    res.send();
};
