import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional()
}).refine(data => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const pregnancyProfileSchema = z.object({
  dueDate: z.string().min(1, 'Due date is required'),
  currentWeek: z.coerce.number().int().min(1).max(42).default(1),
  startDate: z.string().optional().nullable(),
  preferredDoctor: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  importantDates: z.any().optional().nullable()
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(150),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('NOT_STARTED'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable()
});

export const updateProjectSchema = projectSchema.partial();

export const taskSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  name: z.string().min(2, 'Task name must be at least 2 characters').max(150),
  description: z.string().max(1000).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  dueDate: z.string().optional().nullable()
});

export const updateTaskSchema = taskSchema.partial();

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor ID is required'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  appointmentType: z.string().min(2, 'Appointment type is required'),
  notes: z.string().max(1000).optional().nullable(),
  status: z.enum(['UPCOMING', 'COMPLETED', 'CANCELLED']).default('UPCOMING')
});

export const updateAppointmentSchema = appointmentSchema.partial();

export const reminderSchema = z.object({
  title: z.string().min(2, 'Reminder title required').max(150),
  reminderType: z.string().min(2).default('APPOINTMENT'),
  reminderDate: z.string().min(1, 'Reminder date required'),
  isCompleted: z.boolean().default(false)
});

export const milestoneSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().optional().nullable(),
  targetWeek: z.coerce.number().int().min(1).max(42),
  isCompleted: z.boolean().default(false)
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  sessionId: z.string().optional(),
  currentWeek: z.number().int().min(1).max(42).optional()
});

export const askDoctorSchema = z.object({
  concern: z.string().min(3, 'Please describe your concern').max(1000),
  currentWeek: z.number().int().min(1).max(42).optional()
});
