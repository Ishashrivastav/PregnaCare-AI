import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { taskSchema, updateTaskSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', validateBody(taskSchema), TaskController.createTask);
router.put('/:id', validateBody(updateTaskSchema), TaskController.updateTask);
router.patch('/:id/complete', TaskController.toggleComplete);
router.patch('/:id/status', validateBody(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
