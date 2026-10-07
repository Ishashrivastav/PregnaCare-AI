import { Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service.js';
import { AISafetyService } from '../services/aiSafety.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class ChatController {
  static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { message, sessionId, currentWeek } = req.body;
      const result = await ChatService.processMessage(req.user!.id, {
        message,
        sessionId,
        currentWeek,
      });
      sendSuccess(res, result, 'Message processed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const history = await ChatService.getChatHistory(req.user!.id);
      sendSuccess(res, history, 'Chat history retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async deleteSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ChatService.clearSession(req.user!.id, req.params.id);
      sendSuccess(res, { deleted: true }, 'Chat session deleted');
    } catch (error) {
      next(error);
    }
  }

  static async askDoctor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { concern, currentWeek } = req.body;
      const result = AISafetyService.generateDoctorQuestions(concern, currentWeek);
      sendSuccess(res, result, 'Doctor preparation questions generated');
    } catch (error) {
      next(error);
    }
  }
}
