import { Router } from 'express';
import { PregnancyController } from '../controllers/pregnancy.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { pregnancyProfileSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/profile', PregnancyController.getProfile);
router.post('/profile', validateBody(pregnancyProfileSchema), PregnancyController.createProfile);
router.put('/profile', validateBody(pregnancyProfileSchema.partial()), PregnancyController.updateProfile);

export default router;
