import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export class TaskService {
  static async getTasks(userId: string, filters?: {
    projectId?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    const where: any = { userId };

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.priority && filters.priority !== 'ALL') {
      where.priority = filters.priority;
    }

    if (filters?.search) {
      where.name = { contains: filters.search };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return tasks;
  }

  static async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
    }

    if (task.userId !== userId) {
      throw new AppError('Access denied. You do not own this task.', 403, 'FORBIDDEN');
    }

    return task;
  }

  static async createTask(userId: string, data: {
    projectId: string;
    name: string;
    description?: string | null;
    priority?: any;
    status?: any;
    dueDate?: string | null;
  }) {
    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new AppError('Associated project not found.', 404, 'PROJECT_NOT_FOUND');
    }

    if (project.userId !== userId) {
      throw new AppError('Access denied. Project belongs to another user.', 403, 'FORBIDDEN');
    }

    const task = await prisma.task.create({
      data: {
        userId,
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return task;
  }

  static async updateTask(userId: string, taskId: string, data: any) {
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this task.', 403, 'FORBIDDEN');
    }

    if (data.projectId && data.projectId !== existing.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
      });
      if (!project || project.userId !== userId) {
        throw new AppError('Invalid target project.', 400, 'INVALID_PROJECT');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updated;
  }

  static async toggleComplete(userId: string, taskId: string) {
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this task.', 403, 'FORBIDDEN');
    }

    const newStatus = existing.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updated;
  }

  static async deleteTask(userId: string, taskId: string) {
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      throw new AppError('Task not found.', 404, 'TASK_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this task.', 403, 'FORBIDDEN');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { id: taskId, deleted: true };
  }
}
