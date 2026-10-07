import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Shared Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('NOT_STARTED'),
});

const taskSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  name: z.string().min(1, 'Task name is required').max(150),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
});

// Helper calculation functions used in Dashboard & Projects
function calculateProjectProgress(tasks: Array<{ status: string }>): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  return Math.round((completed / tasks.length) * 100);
}

function filterTasks(
  tasks: Array<{ name: string; status: string; priority: string; projectId: string }>,
  filters: { query?: string; status?: string; priority?: string; projectId?: string }
) {
  return tasks.filter((t) => {
    if (filters.query && !t.name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'ALL' && t.status !== filters.status) {
      return false;
    }
    if (filters.priority && filters.priority !== 'ALL' && t.priority !== filters.priority) {
      return false;
    }
    if (filters.projectId && filters.projectId !== 'ALL' && t.projectId !== filters.projectId) {
      return false;
    }
    return true;
  });
}

function getTrimesterInfo(week: number): { trimester: string; progress: number } {
  const boundedWeek = Math.min(Math.max(week, 1), 40);
  const progress = Math.round((boundedWeek / 40) * 100);
  let trimester = 'First Trimester';
  if (boundedWeek >= 14 && boundedWeek <= 27) {
    trimester = 'Second Trimester';
  } else if (boundedWeek >= 28) {
    trimester = 'Third Trimester';
  }
  return { trimester, progress };
}

describe('Frontend Form Validation & Schemas', () => {
  it('should validate correct login credentials', () => {
    const valid = loginSchema.safeParse({
      email: 'demo@pregnacare.com',
      password: 'Password123!',
    });
    expect(valid.success).toBe(true);
  });

  it('should reject invalid email and short password on login', () => {
    const invalid = loginSchema.safeParse({
      email: 'invalid-email',
      password: '123',
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should validate register form with matching password', () => {
    const valid = registerSchema.safeParse({
      fullName: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(valid.success).toBe(true);
  });

  it('should reject register form if passwords do not match', () => {
    const mismatch = registerSchema.safeParse({
      fullName: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword!',
    });
    expect(mismatch.success).toBe(false);
    if (!mismatch.error) throw new Error('Expected validation error');
    expect(mismatch.error.issues[0].message).toBe("Passwords don't match");
  });
});

describe('Project & Task Management Frontend Logic', () => {
  it('should validate valid project creation payload', () => {
    const result = projectSchema.safeParse({
      name: 'Hospital Preparation',
      description: 'Checklists and documents for delivery day',
      status: 'IN_PROGRESS',
    });
    expect(result.success).toBe(true);
  });

  it('should validate valid task creation payload', () => {
    const result = taskSchema.safeParse({
      projectId: 'proj_123',
      name: 'Prepare hospital bag and insurance documents',
      priority: 'HIGH',
      status: 'PENDING',
    });
    expect(result.success).toBe(true);
  });

  it('should dynamically calculate project progress percentage', () => {
    const emptyTasks: Array<{ status: string }> = [];
    expect(calculateProjectProgress(emptyTasks)).toBe(0);

    const tasks = [
      { status: 'COMPLETED' },
      { status: 'COMPLETED' },
      { status: 'COMPLETED' },
      { status: 'PENDING' },
      { status: 'IN_PROGRESS' },
    ];
    // 3 out of 5 = 60%
    expect(calculateProjectProgress(tasks)).toBe(60);

    const allCompleted = [{ status: 'COMPLETED' }, { status: 'COMPLETED' }];
    expect(calculateProjectProgress(allCompleted)).toBe(100);
  });
});

describe('Task Search and Multi-Criteria Filtering', () => {
  const sampleTasks = [
    { name: 'Prepare hospital bag', status: 'PENDING', priority: 'HIGH', projectId: 'p1' },
    { name: 'Choose pediatrician', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: 'p1' },
    { name: 'Install car seat', status: 'COMPLETED', priority: 'HIGH', projectId: 'p2' },
    { name: 'Pack comfortable slippers', status: 'COMPLETED', priority: 'LOW', projectId: 'p1' },
  ];

  it('should filter tasks by search query', () => {
    const filtered = filterTasks(sampleTasks, { query: 'hospital' });
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Prepare hospital bag');
  });

  it('should filter tasks by status', () => {
    const completed = filterTasks(sampleTasks, { status: 'COMPLETED' });
    expect(completed.length).toBe(2);
  });

  it('should filter tasks by priority', () => {
    const high = filterTasks(sampleTasks, { priority: 'HIGH' });
    expect(high.length).toBe(2);
  });

  it('should filter tasks by project association', () => {
    const p2Tasks = filterTasks(sampleTasks, { projectId: 'p2' });
    expect(p2Tasks.length).toBe(1);
    expect(p2Tasks[0].name).toBe('Install car seat');
  });

  it('should combine multiple filters simultaneously', () => {
    const result = filterTasks(sampleTasks, {
      status: 'COMPLETED',
      priority: 'HIGH',
      projectId: 'p2',
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Install car seat');
  });
});

describe('Dashboard Pregnancy Trimester and Countdown Logic', () => {
  it('should calculate correct trimester and progress for Week 10 (1st Trimester)', () => {
    const { trimester, progress } = getTrimesterInfo(10);
    expect(trimester).toBe('First Trimester');
    expect(progress).toBe(25);
  });

  it('should calculate correct trimester and progress for Week 24 (2nd Trimester)', () => {
    const { trimester, progress } = getTrimesterInfo(24);
    expect(trimester).toBe('Second Trimester');
    expect(progress).toBe(60);
  });

  it('should calculate correct trimester and progress for Week 34 (3rd Trimester)', () => {
    const { trimester, progress } = getTrimesterInfo(34);
    expect(trimester).toBe('Third Trimester');
    expect(progress).toBe(85);
  });
});
