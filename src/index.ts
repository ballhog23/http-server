import express, { Request, Response, NextFunction } from 'express';
import { middlewareLogResponses } from './api/middlewareLogResponses.js';
import { middlewareFileServerHits } from './api/middlewareFileServerHits.js';
import { handlerReadiness } from './api/readiness.js';
import { metricsHandler } from './api/metrics.js';
import { handlerValidateChirp } from './api/validateChirp.js';
import { resetHandler } from './api/reset.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// middleware
app.use( middlewareLogResponses);
app.use('/app', middlewareFileServerHits, express.static("./src/app"));

// routes
app.get('/api/healthz', handlerReadiness)
app.post('/api/validate_chirp', handlerValidateChirp)
app.get('/admin/metrics', metricsHandler)
app.post('/admin/reset', resetHandler)


// server
app.listen(PORT, () => console.log(`🚀 app running at http://localhost:${PORT}/app/`))