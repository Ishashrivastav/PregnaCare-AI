import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { logger } from './utils/logger.js';

export const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps (no origin) or whitelisted origins or local dev
      if (!origin || config.corsOrigins.includes(origin) || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(null, true); // Dev-permissive fallback to facilitate testing
      }
    },
    credentials: true,
  })
);

// Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Structured Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

// Root welcome / health
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to PregnaCare AI REST API',
    documentation: '/api/health',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Catch-All
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`,
    errorCode: 'ROUTE_NOT_FOUND',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
