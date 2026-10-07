import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
