export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyProfile {
  id: string;
  userId: string;
  dueDate: string;
  currentWeek: number;
  trimester: number;
  startDate?: string | null;
  preferredDoctor?: string | null;
  notes?: string | null;
  importantDates?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  totalTasks?: number;
  completedTasks?: number;
  progressPercentage?: number;
}

export interface Task {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalClinic: string;
  location: string;
  experience: number;
  rating: number;
  availability: string;
  profileImage?: string | null;
  about?: string | null;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctor?: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  notes?: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  reminderType: string;
  reminderDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  targetWeek: number;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatSessionId: string;
  role: MessageRole;
  content: string;
  concernCategory?: string | null;
  recommendedDoctorSpecialty?: string | null;
  isSafetyAlert?: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  projectsInProgress: number;
  currentPregnancyWeek: number;
  trimester: number;
  estimatedDueDate?: string | null;
  daysRemaining?: number;
  pregnancyProgressPercentage?: number;
  upcomingAppointments: number;
  completedAppointments: number;
  upcomingTasks: number;
  completedMilestones: number;
  totalMilestones: number;
  recentTasks?: Task[];
  nextAppointment?: Appointment | null;
  nextMilestone?: Milestone | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  pregnancyProfile?: PregnancyProfile | null;
}
