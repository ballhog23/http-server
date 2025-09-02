import express from 'express';
import { middlewareLogResponses } from './api/middlewareLogResponses.js';
import { middlewareFileServerHits } from './api/middlewareFileServerHits.js';
import { errorHandler } from './api/middlewareErrorHandler.js';
import { handlerReadiness } from './api/readiness.js';
import { metricsHandler } from './api/metrics.js';
import { handlerValidateChirp } from './api/validateChirp.js';
import { resetHandler } from './api/reset.js';

process.loadEnvFile();

const PORT = process.env.PORT || 8080;
const app = express();

// middleware
app.use(express.json(), middlewareLogResponses);
app.use('/app', middlewareFileServerHits, express.static("./src/app"));

// routes
app.get('/api/healthz', (req, res, next) => {
   Promise.resolve(handlerReadiness(req, res)).catch(next);
})

app.post('/api/validate_chirp', (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next)
})

app.get('/admin/metrics', (req, res, next) => {
    Promise.resolve(metricsHandler(req, res)).catch(next)
})

app.post('/admin/reset', (req, res, next) => {
    Promise.resolve(resetHandler(req, res)).catch(next)
})

// call this after the fact to allow error handling in all routes
app.use(errorHandler)


// server
app.listen(PORT, () => console.log(`🚀 app running at http://localhost:${PORT}/app/`))