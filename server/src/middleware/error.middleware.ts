import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(err.message || 'Unhandled error', {
    path: req.path,
    method: req.method,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(422).json({
      success: false,
      message: `Validation failed: ${messages}`,
      errorCode: 'VALIDATION_ERROR',
      details: err.errors,
    });
    return;
  }

  // Handle Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
    return;
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    res.status(409).json({
      success: false,
      message: 'A unique constraint was violated. Record already exists.',
      errorCode: 'CONFLICT',
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Record not found.',
      errorCode: 'NOT_FOUND',
    });
    return;
  }

  // Default Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' && statusCode === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
  });
}
