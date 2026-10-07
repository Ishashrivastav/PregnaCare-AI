import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Doctor directory can be accessed by authenticated users
router.use(authenticate);

router.get('/', DoctorController.getDoctors);
router.get('/:id', DoctorController.getDoctorById);

export default router;
