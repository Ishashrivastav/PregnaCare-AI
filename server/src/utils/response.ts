import { Response } from 'express';

export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message = 'Operation successful',
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errorCode = 'INTERNAL_SERVER_ERROR'
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
}

export class AppError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode = 400, errorCode = 'BAD_REQUEST') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
