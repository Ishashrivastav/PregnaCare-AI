import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { appointmentSchema, updateAppointmentSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', AppointmentController.getAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.post('/', validateBody(appointmentSchema), AppointmentController.createAppointment);
router.put('/:id', validateBody(updateAppointmentSchema), AppointmentController.updateAppointment);
router.patch('/:id/cancel', AppointmentController.cancelAppointment);
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;
