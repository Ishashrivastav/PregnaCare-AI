import { Response, NextFunction } from 'express';
import { MilestoneService } from '../services/milestone.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class MilestoneController {
  static async getMilestones(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const milestones = await MilestoneService.getMilestones(req.user!.id);
      sendSuccess(res, milestones, 'Milestones retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async toggleMilestone(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const milestone = await MilestoneService.toggleMilestone(req.user!.id, req.params.id);
      sendSuccess(res, milestone, 'Milestone updated');
    } catch (error) {
      next(error);
    }
  }
}
