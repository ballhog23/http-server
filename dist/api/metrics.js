import { config } from '../config.js';
export const metricsHandler = async (_, res) => {
    res.set({ 'Content-Type': 'text/html; charset=utf-8' });
    res.send(`
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileServerHits} times!</p>
        `);
};
