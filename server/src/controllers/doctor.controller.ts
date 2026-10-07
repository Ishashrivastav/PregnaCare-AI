import { Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctor.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class DoctorController {
  static async getDoctors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { search, specialty, location } = req.query as {
        search?: string;
        specialty?: string;
        location?: string;
      };
      const doctors = await DoctorService.getDoctors({ search, specialty, location });
      sendSuccess(res, doctors, 'Doctors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const doctor = await DoctorService.getDoctorById(req.params.id);
      sendSuccess(res, doctor, 'Doctor profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
