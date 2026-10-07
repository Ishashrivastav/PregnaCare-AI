import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { chatMessageSchema, askDoctorSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.post('/', chatRateLimiter, validateBody(chatMessageSchema), ChatController.sendMessage);
router.get('/history', ChatController.getHistory);
router.delete('/sessions/:id', ChatController.deleteSession);
router.post('/ask-doctor', validateBody(askDoctorSchema), ChatController.askDoctor);

export default router;
