import { Router } from 'express';
import authRoutes from './auth.routes.js';
import pregnancyRoutes from './pregnancy.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import doctorRoutes from './doctor.routes.js';
import appointmentRoutes from './appointment.routes.js';
import reminderRoutes from './reminder.routes.js';
import milestoneRoutes from './milestone.routes.js';
import chatRoutes from './chat.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PregnaCare AI API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/pregnancy', pregnancyRoutes);
apiRouter.use('/pregnancy-profile', pregnancyRoutes); // Spec alias compatibility
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/tasks', taskRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/reminders', reminderRoutes);
apiRouter.use('/milestones', milestoneRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
