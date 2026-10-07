import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { projectSchema, updateProjectSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', validateBody(projectSchema), ProjectController.createProject);
router.put('/:id', validateBody(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;
