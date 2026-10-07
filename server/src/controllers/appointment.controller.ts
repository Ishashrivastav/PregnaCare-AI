import { Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { sendSuccess } from '../utils/response.js';

export class AppointmentController {
  static async getAppointments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, date } = req.query as { status?: string; date?: string };
      const appointments = await AppointmentService.getAppointments(req.user!.id, { status, date });
      sendSuccess(res, appointments, 'Appointments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAppointmentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.getAppointmentById(req.user!.id, req.params.id);
      sendSuccess(res, appointment, 'Appointment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.createAppointment(req.user!.id, req.body);
      sendSuccess(res, appointment, 'Appointment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.updateAppointment(req.user!.id, req.params.id, req.body);
      sendSuccess(res, appointment, 'Appointment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async cancelAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.cancelAppointment(req.user!.id, req.params.id);
      sendSuccess(res, appointment, 'Appointment cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AppointmentService.deleteAppointment(req.user!.id, req.params.id);
      sendSuccess(res, result, 'Appointment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
