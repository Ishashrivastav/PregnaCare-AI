import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export class ProjectService {
  static async getProjects(userId: string, filters?: { search?: string; status?: string }) {
    const where: any = { userId };

    if (filters?.search) {
      where.name = { contains: filters.search };
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...project,
        totalTasks,
        completedTasks,
        progressPercentage,
      };
    });
  }

  static async getProjectById(userId: string, projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found.', 404, 'PROJECT_NOT_FOUND');
    }

    // Strict ownership check
    if (project.userId !== userId) {
      throw new AppError('Access denied. You do not own this project.', 403, 'FORBIDDEN');
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      totalTasks,
      completedTasks,
      progressPercentage,
    };
  }

  static async createProject(userId: string, data: {
    name: string;
    description?: string | null;
    status?: any;
    startDate?: string | null;
    endDate?: string | null;
  }) {
    const project = await prisma.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        status: data.status || 'NOT_STARTED',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return {
      ...project,
      totalTasks: 0,
      completedTasks: 0,
      progressPercentage: 0,
    };
  }

  static async updateProject(userId: string, projectId: string, data: any) {
    // Verify ownership
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      throw new AppError('Project not found.', 404, 'PROJECT_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this project.', 403, 'FORBIDDEN');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        tasks: true,
      },
    });

    const totalTasks = updated.tasks.length;
    const completedTasks = updated.tasks.filter(t => t.status === 'COMPLETED').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...updated,
      totalTasks,
      completedTasks,
      progressPercentage,
    };
  }

  static async deleteProject(userId: string, projectId: string) {
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      throw new AppError('Project not found.', 404, 'PROJECT_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this project.', 403, 'FORBIDDEN');
    }

    // Delete project cascade deletes tasks
    await prisma.project.delete({
      where: { id: projectId },
    });

    return { id: projectId, deleted: true };
  }
}
