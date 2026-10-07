import { Response, NextFunction } from 'express';
import { ReminderService } from '../services/reminder.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class ReminderController {
  static async getReminders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reminders = await ReminderService.getReminders(req.user!.id);
      sendSuccess(res, reminders, 'Reminders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createReminder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reminder = await ReminderService.createReminder(req.user!.id, req.body);
      sendSuccess(res, reminder, 'Reminder created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async toggleComplete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reminder = await ReminderService.toggleComplete(req.user!.id, req.params.id);
      sendSuccess(res, reminder, 'Reminder updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteReminder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ReminderService.deleteReminder(req.user!.id, req.params.id);
      sendSuccess(res, result, 'Reminder deleted');
    } catch (error) {
      next(error);
    }
  }
}
