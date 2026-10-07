import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export function calculateTrimester(week: number): number {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export class PregnancyService {
  static async getProfile(userId: string) {
    const profile = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });
    return profile;
  }

  static async createProfile(userId: string, data: {
    dueDate: string;
    currentWeek?: number;
    startDate?: string | null;
    preferredDoctor?: string | null;
    notes?: string | null;
    importantDates?: any;
  }) {
    const existing = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new AppError('Pregnancy profile already exists. Use update instead.', 409, 'PROFILE_EXISTS');
    }

    const currentWeek = data.currentWeek || 1;
    const profile = await prisma.pregnancyProfile.create({
      data: {
        userId,
        dueDate: new Date(data.dueDate),
        currentWeek,
        startDate: data.startDate ? new Date(data.startDate) : null,
        preferredDoctor: data.preferredDoctor,
        notes: data.notes,
        importantDates: data.importantDates ? JSON.stringify(data.importantDates) : null,
      },
    });

    return {
      ...profile,
      trimester: calculateTrimester(profile.currentWeek),
    };
  }

  static async updateProfile(userId: string, data: {
    dueDate?: string;
    currentWeek?: number;
    startDate?: string | null;
    preferredDoctor?: string | null;
    notes?: string | null;
    importantDates?: any;
  }) {
    const existing = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      // If profile does not exist, create it cleanly
      if (!data.dueDate) {
        throw new AppError('Due date is required to create a pregnancy profile.', 400, 'MISSING_DUE_DATE');
      }
      return this.createProfile(userId, data as any);
    }

    const updateData: any = {};
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.currentWeek !== undefined) updateData.currentWeek = data.currentWeek;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.preferredDoctor !== undefined) updateData.preferredDoctor = data.preferredDoctor;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.importantDates !== undefined) updateData.importantDates = data.importantDates ? JSON.stringify(data.importantDates) : null;

    const profile = await prisma.pregnancyProfile.update({
      where: { userId },
      data: updateData,
    });

    return {
      ...profile,
      trimester: calculateTrimester(profile.currentWeek),
    };
  }
}
