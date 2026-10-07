import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/database.js';

describe('PregnaCare AI Full-Stack REST API Integration Tests', () => {
  let authToken = '';
  let secondUserToken = '';
  let createdProjectId = '';
  let createdTaskId = '';
  let doctorId = '';
  let createdAppointmentId = '';

  const testUser = {
    fullName: 'Test Mother',
    email: `test_mother_${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  const secondUser = {
    fullName: 'Second Mother',
    email: `second_mother_${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  beforeAll(async () => {
    await prisma.$connect();
    // Ensure at least one doctor exists
    let doc = await prisma.doctor.findFirst();
    if (!doc) {
      doc = await prisma.doctor.create({
        data: {
          name: 'Dr. Jane Test, MD',
          specialty: 'Obstetrician / Gynecologist',
          hospitalClinic: 'Test Maternity Care',
          location: 'Test City',
          experience: 10,
          rating: 4.9,
        },
      });
    }
    doctorId = doc.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 1. Health Check
  describe('Health Check API', () => {
    it('GET /api/health should return 200 and operational status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('PregnaCare AI API is running');
    });
  });

  // 2. Authentication Tests
  describe('Authentication API', () => {
    it('POST /api/auth/register should successfully register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.passwordHash).toBeUndefined(); // Never expose passwordHash!
      authToken = res.body.data.token;
    });

    it('POST /api/auth/register should reject duplicate email with 409 Conflict', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('EMAIL_EXISTS');
    });

    it('POST /api/auth/login should authenticate user and return token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('POST /api/auth/login should reject invalid credentials with 401', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('INVALID_CREDENTIALS');
    });

    it('GET /api/auth/me should return current user details with valid JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    });

    it('GET /api/auth/me should reject requests without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    // Register second user for ownership protection tests
    it('Register second user for ownership validation', async () => {
      const res = await request(app).post('/api/auth/register').send(secondUser);
      expect(res.status).toBe(201);
      secondUserToken = res.body.data.token;
    });
  });

  // 3. Pregnancy Profile Tests
  describe('Pregnancy Profile API', () => {
    it('POST /api/pregnancy/profile should create a pregnancy profile', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 100);

      const res = await request(app)
        .post('/api/pregnancy/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dueDate: futureDate.toISOString(),
          currentWeek: 26,
          preferredDoctor: 'Dr. Jane Test, MD',
          notes: 'Healthy vitals, regular movements observed.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.currentWeek).toBe(26);
      expect(res.body.data.trimester).toBe(2);
    });

    it('GET /api/pregnancy/profile should return the pregnancy profile', async () => {
      const res = await request(app)
        .get('/api/pregnancy/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.currentWeek).toBe(26);
    });

    it('PUT /api/pregnancy/profile should update the pregnancy profile', async () => {
      const res = await request(app)
        .put('/api/pregnancy/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentWeek: 28,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.currentWeek).toBe(28);
      expect(res.body.data.trimester).toBe(3); // Week 28 is Trimester 3!
    });
  });

  // 4. Project Management Tests
  describe('Project Management API & Ownership Protection', () => {
    it('POST /api/projects should create a pregnancy project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Hospital Preparation Plan',
          description: 'Packing delivery bag and finalizing admission paperwork',
          status: 'IN_PROGRESS',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Hospital Preparation Plan');
      expect(res.body.data.progressPercentage).toBe(0);
      createdProjectId = res.body.data.id;
    });

    it('GET /api/projects should list projects with dynamic progress', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/projects/:id should retrieve project by ID for owner', async () => {
      const res = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdProjectId);
    });

    it('SECURITY: Second user should NOT be able to view first user project (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${secondUserToken}`);
      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('SECURITY: Second user should NOT be able to delete first user project (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${secondUserToken}`);
      expect(res.status).toBe(403);
    });
  });

  // 5. Task Management Tests & Dynamic Calculation
  describe('Task Management API & Dynamic Calculations', () => {
    it('POST /api/tasks should create a task under project', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          projectId: createdProjectId,
          name: 'Prepare hospital bag essentials',
          priority: 'HIGH',
          status: 'PENDING',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Prepare hospital bag essentials');
      createdTaskId = res.body.data.id;
    });

    it('PATCH /api/tasks/:id/complete should toggle task completion', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('COMPLETED');
    });

    it('Project progress should now dynamically calculate 100% (1/1 completed)', async () => {
      const res = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.totalTasks).toBe(1);
      expect(res.body.data.completedTasks).toBe(1);
      expect(res.body.data.progressPercentage).toBe(100);
    });
  });

  // 6. Doctor Directory & Appointment Tests
  describe('Doctor Directory and Appointments API', () => {
    it('GET /api/doctors should return doctors list with search and filter', async () => {
      const res = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/appointments should schedule simulated consultation', async () => {
      const apptDate = new Date();
      apptDate.setDate(apptDate.getDate() + 7);

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          doctorId,
          appointmentDate: apptDate.toISOString(),
          appointmentTime: '11:00 AM',
          appointmentType: 'Prenatal Routine Checkup',
          notes: 'Review fetal kicks and blood pressure',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('UPCOMING');
      createdAppointmentId = res.body.data.id;
    });

    it('PATCH /api/appointments/:id/cancel should cancel appointment', async () => {
      const res = await request(app)
        .patch(`/api/appointments/${createdAppointmentId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CANCELLED');
    });
  });

  // 7. Dashboard API (Real Database-Derived Stats)
  describe('Dashboard API', () => {
    it('GET /api/dashboard should return real database-derived statistics', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const stats = res.body.data;
      expect(stats.totalProjects).toBeGreaterThanOrEqual(1);
      expect(stats.totalTasks).toBeGreaterThanOrEqual(1);
      expect(stats.completedTasks).toBeGreaterThanOrEqual(1);
      expect(stats.currentPregnancyWeek).toBe(28);
      expect(stats.trimester).toBe(3);
      expect(stats.pregnancyProgressPercentage).toBeDefined();
    });
  });

  // 8. Safety-First AI Chat System
  describe('AI PregnaCare Assistant & Safety First Layer', () => {
    it('POST /api/chat should intercept acute emergency symptoms with URGENT escalation without diagnosis', async () => {
      const res = await request(app)
        .post('/api/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'I have severe abdominal pain and heavy bleeding.',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.isUrgent).toBe(true);
      expect(res.body.data.category).toBe('Urgent Concern');
      expect(res.body.data.message.content).toContain('URGENT HEALTH NOTICE');
      expect(res.body.data.message.content).not.toContain('You have'); // NEVER diagnose!
    });

    it('POST /api/chat should return educational advice with medical disclaimer for general questions', async () => {
      const res = await request(app)
        .post('/api/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'What questions can I discuss at my prenatal appointment?',
          currentWeek: 28,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.isUrgent).toBe(false);
      expect(res.body.data.disclaimer).toContain('PregnaCare AI provides general educational');
    });

    it('POST /api/chat/ask-doctor should generate questions to discuss with doctor', async () => {
      const res = await request(app)
        .post('/api/chat/ask-doctor')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          concern: 'I have been experiencing mild lower back discomfort in the evenings.',
          currentWeek: 28,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.suggestedQuestions.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data.warningSignsToWatch).toBeDefined();
    });
  });
});
