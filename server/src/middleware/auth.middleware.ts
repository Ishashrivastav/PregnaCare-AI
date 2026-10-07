import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthenticatedRequest, AuthUser } from '../types/index.js';
import { sendError } from '../utils/response.js';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. No token provided.', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
    };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Your session has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
      return;
    }
    sendError(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN');
  }
}
