import { Router } from 'express';
import { MilestoneController } from '../controllers/milestone.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', MilestoneController.getMilestones);
router.patch('/:id/toggle', MilestoneController.toggleMilestone);

export default router;
