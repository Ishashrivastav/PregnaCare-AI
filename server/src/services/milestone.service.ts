import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export const DEFAULT_PREGNANCY_MILESTONES = [
  { title: 'Pregnancy Confirmation', description: 'Confirmed pregnancy with primary healthcare provider.', targetWeek: 4 },
  { title: 'First Prenatal Care Visit', description: 'Initial comprehensive prenatal consultation, baseline tests.', targetWeek: 8 },
  { title: 'First Trimester Completed', description: 'Major organ development complete; entering second trimester.', targetWeek: 13 },
  { title: 'Mid-Pregnancy Anatomy Scan', description: 'Detailed developmental ultrasound checkup.', targetWeek: 20 },
  { title: 'Fetal Movement First Felt', description: 'Noticing first flutter or kicks (quickening).', targetWeek: 22 },
  { title: 'Second Trimester Completed', description: 'Beginning third trimester preparation phase.', targetWeek: 27 },
  { title: 'Hospital & Birth Center Selection', description: 'Tour chosen maternity hospital and review amenities.', targetWeek: 32 },
  { title: 'Hospital Bag & Document Preparation', description: 'Essential items, birth plan, medical cards packed.', targetWeek: 36 },
  { title: 'Full Term Milestone', description: 'Baby reaches full term readiness.', targetWeek: 39 },
];

export class MilestoneService {
  static async getMilestones(userId: string) {
    let milestones = await prisma.milestone.findMany({
      where: { userId },
      orderBy: { targetWeek: 'asc' },
    });

    // Auto-seed default milestones for user if none exist yet
    if (milestones.length === 0) {
      await prisma.$transaction(
        DEFAULT_PREGNANCY_MILESTONES.map(m =>
          prisma.milestone.create({
            data: {
              userId,
              title: m.title,
              description: m.description,
              targetWeek: m.targetWeek,
              isCompleted: false,
            },
          })
        )
      );
      milestones = await prisma.milestone.findMany({
        where: { userId },
        orderBy: { targetWeek: 'asc' },
      });
    }

    return milestones;
  }

  static async toggleMilestone(userId: string, id: string) {
    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) throw new AppError('Milestone not found.', 404, 'NOT_FOUND');
    if (milestone.userId !== userId) throw new AppError('Forbidden.', 403, 'FORBIDDEN');

    const isCompleted = !milestone.isCompleted;
    return prisma.milestone.update({
      where: { id },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }
}
