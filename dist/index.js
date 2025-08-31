import express from 'express';
import { middlewareLogResponses } from './api/middlewareLogResponses.js';
import { middlewareFileServerHits } from './api/middlewareFileServerHits.js';
import { handlerReadiness } from './api/readiness.js';
import { metricsHandler } from './api/metrics.js';
import { resetHandler } from './api/reset.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
// middleware
app.use(middlewareLogResponses);
app.use('/app', middlewareFileServerHits, express.static("./src/app"));
// routes
app.get('/api/reset', resetHandler);
app.get('/api/metrics', metricsHandler);
app.get('/api/healthz', handlerReadiness);
app.listen(PORT, () => console.log(`🚀 server running on http://localhost:${PORT}/app/`));
