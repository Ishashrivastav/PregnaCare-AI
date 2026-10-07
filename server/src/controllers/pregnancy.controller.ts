import { Response, NextFunction } from 'express';
import { PregnancyService } from '../services/pregnancy.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class PregnancyController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await PregnancyService.getProfile(req.user!.id);
      sendSuccess(res, profile, 'Pregnancy profile retrieved', 200);
    } catch (error) {
      next(error);
    }
  }

  static async createProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await PregnancyService.createProfile(req.user!.id, req.body);
      sendSuccess(res, profile, 'Pregnancy profile created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await PregnancyService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, profile, 'Pregnancy profile updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
