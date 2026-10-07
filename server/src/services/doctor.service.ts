import { prisma } from '../config/database.js';
import { AppError } from '../utils/response.js';

export class DoctorService {
  static async getDoctors(filters?: {
    search?: string;
    specialty?: string;
    location?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { specialty: { contains: filters.search } },
        { hospitalClinic: { contains: filters.search } },
        { location: { contains: filters.search } },
      ];
    }

    if (filters?.specialty && filters.specialty !== 'ALL') {
      where.specialty = { contains: filters.specialty };
    }

    if (filters?.location && filters.location !== 'ALL') {
      where.location = { contains: filters.location };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: [{ rating: 'desc' }, { experience: 'desc' }],
    });

    return doctors;
  }

  static async getDoctorById(id: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new AppError('Doctor not found in directory.', 404, 'DOCTOR_NOT_FOUND');
    }

    return doctor;
  }
}
