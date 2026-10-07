import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class DashboardController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getStats(req.user!.id);
      sendSuccess(res, stats, 'Dashboard statistics retrieved');
    } catch (error) {
      next(error);
    }
  }
}
