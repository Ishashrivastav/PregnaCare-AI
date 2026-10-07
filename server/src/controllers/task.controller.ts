import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class TaskController {
  static async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { projectId, status, priority, search } = req.query as {
        projectId?: string;
        status?: string;
        priority?: string;
        search?: string;
      };
      const tasks = await TaskService.getTasks(req.user!.id, { projectId, status, priority, search });
      sendSuccess(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getTaskById(req.user!.id, req.params.id);
      sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.user!.id, req.body);
      sendSuccess(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.updateTask(req.user!.id, req.params.id, req.body);
      sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleComplete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.toggleComplete(req.user!.id, req.params.id);
      sendSuccess(res, task, 'Task status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await TaskService.deleteTask(req.user!.id, req.params.id);
      sendSuccess(res, result, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
