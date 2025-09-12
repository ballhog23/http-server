import express from 'express';
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { middlewareLogResponses } from './api/middlewareLogResponses.js';
import { middlewareFileServerHits } from './api/middlewareFileServerHits.js';
import { errorHandler } from './api/middlewareErrorHandler.js';
import { handlerReadiness } from './api/readiness.js';
import { metricsHandler } from './api/metrics.js';
import { handlerChirps, handlerDeleteChirp } from './api/chirps.js';
import { handlerGetAllChirps, handlerGetSingleChirp } from './api/chirps.js';
import { resetHandler } from './api/reset.js';
import { userHandler, updateEmailAndPasswordHandler } from './api/users.js';
import { loginHandler, refreshHandler, revokeHandler } from './api/auth.js';
import { config } from './config.js';

process.loadEnvFile();

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const { port } = config.api

// middleware
app.use(express.json(), middlewareLogResponses);
app.use('/app', middlewareFileServerHits, express.static("./src/app"));

// routes
app.get('/api/healthz', (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
})

app.post('/api/chirps', (req, res, next) => {
    Promise.resolve(handlerChirps(req, res)).catch(next)
})

app.get('/api/chirps', (req, res, next) => {
    Promise.resolve(handlerGetAllChirps(req, res)).catch(next)
})

app.get('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerGetSingleChirp(req, res)).catch(next)
})

app.delete('/api/chirps/:chirpID', (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next)
})

app.post('/api/users', (req, res, next) => {
    Promise.resolve(userHandler(req, res)).catch(next)
})

app.put('/api/users', (req, res, next) => {
    Promise.resolve(updateEmailAndPasswordHandler(req, res)).catch(next)
})

app.post('/api/login', (req, res, next) => {
    Promise.resolve(loginHandler(req, res)).catch(next)
})

app.post('/api/refresh', (req, res, next) => {
    Promise.resolve(refreshHandler(req, res)).catch(next)
})

app.post('/api/revoke', (req, res, next) => {
    Promise.resolve(revokeHandler(req, res)).catch(next)
})

app.get('/admin/metrics', (req, res, next) => {
    Promise.resolve(metricsHandler(req, res)).catch(next)
})

app.post('/admin/reset', (req, res, next) => {
    Promise.resolve(resetHandler(req, res)).catch(next)
})

// call this middleware after the fact to allow error handling in all routes
app.use(errorHandler)

// server
app.listen(port, () => console.log(`🚀 app running at http://localhost:${port}/app/`))