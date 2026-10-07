import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export class ReminderService {
  static async getReminders(userId: string) {
    return prisma.reminder.findMany({
      where: { userId },
      orderBy: [{ isCompleted: 'asc' }, { reminderDate: 'asc' }],
    });
  }

  static async createReminder(userId: string, data: {
    title: string;
    reminderType?: string;
    reminderDate: string;
  }) {
    return prisma.reminder.create({
      data: {
        userId,
        title: data.title,
        reminderType: data.reminderType || 'GENERAL',
        reminderDate: new Date(data.reminderDate),
      },
    });
  }

  static async toggleComplete(userId: string, id: string) {
    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new AppError('Reminder not found.', 404, 'NOT_FOUND');
    if (reminder.userId !== userId) throw new AppError('Forbidden.', 403, 'FORBIDDEN');

    return prisma.reminder.update({
      where: { id },
      data: { isCompleted: !reminder.isCompleted },
    });
  }

  static async deleteReminder(userId: string, id: string) {
    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new AppError('Reminder not found.', 404, 'NOT_FOUND');
    if (reminder.userId !== userId) throw new AppError('Forbidden.', 403, 'FORBIDDEN');

    await prisma.reminder.delete({ where: { id } });
    return { id, deleted: true };
  }
}
