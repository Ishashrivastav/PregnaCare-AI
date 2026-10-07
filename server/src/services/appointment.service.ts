import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export class AppointmentService {
  static async getAppointments(userId: string, filters?: { status?: string; date?: string }) {
    const where: any = { userId };

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.date) {
      const searchDate = new Date(filters.date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.appointmentDate = {
        gte: searchDate,
        lt: nextDay,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: true,
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { appointmentTime: 'asc' },
      ],
    });

    return appointments;
  }

  static async getAppointmentById(userId: string, id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found.', 404, 'APPOINTMENT_NOT_FOUND');
    }

    if (appointment.userId !== userId) {
      throw new AppError('Access denied. You do not own this appointment.', 403, 'FORBIDDEN');
    }

    return appointment;
  }

  static async createAppointment(userId: string, data: {
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: string;
    notes?: string | null;
    status?: any;
  }) {
    // Validate doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new AppError('Selected doctor does not exist.', 404, 'DOCTOR_NOT_FOUND');
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId: data.doctorId,
        appointmentDate: new Date(data.appointmentDate),
        appointmentTime: data.appointmentTime,
        appointmentType: data.appointmentType,
        notes: data.notes,
        status: data.status || 'UPCOMING',
      },
      include: {
        doctor: true,
      },
    });

    return appointment;
  }

  static async updateAppointment(userId: string, id: string, data: any) {
    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Appointment not found.', 404, 'APPOINTMENT_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this appointment.', 403, 'FORBIDDEN');
    }

    const updateData: any = {};
    if (data.doctorId) updateData.doctorId = data.doctorId;
    if (data.appointmentDate) updateData.appointmentDate = new Date(data.appointmentDate);
    if (data.appointmentTime) updateData.appointmentTime = data.appointmentTime;
    if (data.appointmentType) updateData.appointmentType = data.appointmentType;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status) updateData.status = data.status;

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        doctor: true,
      },
    });

    return updated;
  }

  static async cancelAppointment(userId: string, id: string) {
    return this.updateAppointment(userId, id, { status: 'CANCELLED' });
  }

  static async deleteAppointment(userId: string, id: string) {
    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('Appointment not found.', 404, 'APPOINTMENT_NOT_FOUND');
    }

    if (existing.userId !== userId) {
      throw new AppError('Access denied. You do not own this appointment.', 403, 'FORBIDDEN');
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return { id, deleted: true };
  }
}
