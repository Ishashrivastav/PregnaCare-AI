import { Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class ProjectController {
  static async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { search, status } = req.query as { search?: string; status?: string };
      const projects = await ProjectService.getProjects(req.user!.id, { search, status });
      sendSuccess(res, projects, 'Projects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.user!.id, req.params.id);
      sendSuccess(res, project, 'Project retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      sendSuccess(res, project, 'Project created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.updateProject(req.user!.id, req.params.id, req.body);
      sendSuccess(res, project, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ProjectService.deleteProject(req.user!.id, req.params.id);
      sendSuccess(res, result, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
