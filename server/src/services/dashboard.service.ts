import { prisma } from '../config/database.js';
import { calculateTrimester } from './pregnancy.service.js';

export class DashboardService {
  static async getStats(userId: string) {
    // 1. Projects stats
    const totalProjects = await prisma.project.count({ where: { userId } });
    const projectsInProgress = await prisma.project.count({
      where: { userId, status: 'IN_PROGRESS' },
    });

    // 2. Tasks stats
    const totalTasks = await prisma.task.count({ where: { userId } });
    const completedTasks = await prisma.task.count({
      where: { userId, status: 'COMPLETED' },
    });
    const pendingTasks = await prisma.task.count({
      where: { userId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
    });

    // 3. Pregnancy Profile
    const profile = await prisma.pregnancyProfile.findUnique({
      where: { userId },
    });

    const currentPregnancyWeek = profile?.currentWeek || 1;
    const trimester = calculateTrimester(currentPregnancyWeek);

    // Days remaining & progress calculation
    let daysRemaining = 0;
    let pregnancyProgressPercentage = Math.round((currentPregnancyWeek / 40) * 100);
    if (pregnancyProgressPercentage > 100) pregnancyProgressPercentage = 100;

    if (profile?.dueDate) {
      const now = new Date();
      const diffTime = new Date(profile.dueDate).getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // 4. Appointments stats
    const upcomingAppointments = await prisma.appointment.count({
      where: { userId, status: 'UPCOMING' },
    });
    const completedAppointments = await prisma.appointment.count({
      where: { userId, status: 'COMPLETED' },
    });

    const nextAppointment = await prisma.appointment.findFirst({
      where: { userId, status: 'UPCOMING' },
      include: { doctor: true },
      orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
    });

    // 5. Tasks upcoming
    const upcomingTasks = pendingTasks;
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      include: { project: { select: { id: true, name: true } } },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 5,
    });

    // 6. Milestones stats
    const totalMilestones = await prisma.milestone.count({ where: { userId } });
    const completedMilestones = await prisma.milestone.count({
      where: { userId, isCompleted: true },
    });

    const nextMilestone = await prisma.milestone.findFirst({
      where: { userId, isCompleted: false },
      orderBy: { targetWeek: 'asc' },
    });

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      projectsInProgress,
      currentPregnancyWeek,
      trimester,
      estimatedDueDate: profile?.dueDate?.toISOString() || null,
      daysRemaining,
      pregnancyProgressPercentage,
      upcomingAppointments,
      completedAppointments,
      upcomingTasks,
      completedMilestones,
      totalMilestones,
      recentTasks,
      nextAppointment,
      nextMilestone,
    };
  }
}
