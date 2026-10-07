import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { reminderSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', ReminderController.getReminders);
router.post('/', validateBody(reminderSchema), ReminderController.createReminder);
router.patch('/:id/toggle', ReminderController.toggleComplete);
router.delete('/:id', ReminderController.deleteReminder);

export default router;
