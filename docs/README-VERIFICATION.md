# PregnaCare AI — README Verification Matrix & Evidence Audit

This document audits and cross-references every technical capability, API endpoint, security feature, and architectural claim documented in `README.md` against the actual implementation in the repository.

---

## 📋 Comprehensive Verification Checklist

| Component / Layer | Verification Item | Implementation Evidence & Source Path | Status |
|---|---|---|---|
| **Authentication** | User Registration & Login | `server/src/controllers/auth.controller.ts`, `apps/web/src/pages/Login.tsx`, `apps/web/src/pages/Register.tsx` | ✅ VERIFIED |
| **Authentication** | Password Hashing | 12-round salted bcrypt hashing in `server/src/controllers/auth.controller.ts` | ✅ VERIFIED |
| **Authentication** | JWT Generation & Verification | HMAC-SHA256 signing and expiration checks in `server/src/middleware/auth.ts` | ✅ VERIFIED |
| **Authentication** | Mobile Secure Storage | Hardware-backed encrypted keychain storage via `expo-secure-store` in `apps/mobile/src/api/client.ts` | ✅ VERIFIED |
| **Projects** | Project CRUD | `server/src/controllers/project.controller.ts`, `apps/web/src/pages/Projects.tsx`, `apps/web/src/pages/ProjectDetail.tsx` | ✅ VERIFIED |
| **Projects** | Dynamic Progress % | Database aggregation formula (`completedTasks / totalTasks * 100`) computed live | ✅ VERIFIED |
| **Projects** | Search & Status Filters | Query params `search` & `status` in `server/src/controllers/project.controller.ts` | ✅ VERIFIED |
| **Tasks** | Task CRUD & Completion | `server/src/controllers/task.controller.ts`, `apps/web/src/pages/Tasks.tsx`, `PATCH /api/tasks/:id/complete` | ✅ VERIFIED |
| **Tasks** | Priority & Status Badges | `LOW`, `MEDIUM`, `HIGH` priorities; `PENDING`, `IN_PROGRESS`, `COMPLETED` statuses | ✅ VERIFIED |
| **Dashboard** | Live Statistical Queries | `server/src/controllers/dashboard.controller.ts`, `apps/web/src/pages/Dashboard.tsx` — zero hardcoded metrics | ✅ VERIFIED |
| **Pregnancy** | Profile Management | `server/src/controllers/pregnancy.controller.ts`, gestational week calculation & trimester bounds | ✅ VERIFIED |
| **Pregnancy** | Timeline & Weekly Content | `apps/web/src/pages/Timeline.tsx`, `apps/web/src/pages/WeeklyInfo.tsx` (all 40 weeks curated) | ✅ VERIFIED |
| **AI Assistant** | Emergency Red-Flag Triage | `server/src/services/ai-safety.service.ts` intercepts heavy bleeding, acute abdominal pain, vision loss | ✅ VERIFIED |
| **AI Assistant** | Refusal of Diagnosis & Drugs | Safety layer rejects diagnostic claims and medication dosage prescriptions | ✅ VERIFIED |
| **AI Assistant** | Educational Fallback Engine | Deterministic clinical educational engine operates without crashing if LLM key is missing | ✅ VERIFIED |
| **Ask Your Doctor** | Consultation Question Prep | `server/src/controllers/chat.controller.ts` (`POST /api/chat/ask-doctor`), `apps/web/src/pages/AskDoctor.tsx` | ✅ VERIFIED |
| **Doctors** | Fictional Specialist Directory | 5 seeded specialists in `server/prisma/seed.ts`, filter by specialty & location | ✅ VERIFIED |
| **Appointments** | Simulated Booking & Cancel | `server/src/controllers/appointment.controller.ts`, simulated disclaimer banner | ✅ VERIFIED |
| **Milestones** | Milestones System | `server/src/controllers/milestone.controller.ts`, `apps/web/src/pages/Milestones.tsx` | ✅ VERIFIED |
| **Reminders** | Reminders System | `server/src/controllers/reminder.controller.ts`, `apps/web/src/pages/Reminders.tsx` | ✅ VERIFIED |
| **Mobile App** | React Native + Expo App | Expo SDK 51, tabs for Dashboard, Pregnancy, Care, Planning, Profile (`apps/mobile`) | ✅ VERIFIED |
| **Mobile Sync** | Cross-Platform Parity | Shared REST API and single database; pull-to-refresh synchronization on mobile | ✅ VERIFIED |
| **Security** | IDOR Ownership Enforcement | Compound query predicates `where: { id, userId }` on all user entities (`tests/api.test.ts`) | ✅ VERIFIED |
| **Security** | Defensive HTTP Headers | Express `helmet` middleware in `server/src/app.ts` | ✅ VERIFIED |
| **Security** | Rate Limiting | `express-rate-limit` on auth (10 req/15min) and chat (20 req/15min) | ✅ VERIFIED |
| **Database** | Prisma Relational Models | 10 models: User, PregnancyProfile, Doctor, Appointment, Project, Task, Reminder, Milestone, ChatSession, ChatMessage | ✅ VERIFIED |
| **Automated Tests** | Integration & Unit Tests | 26 backend integration tests passing + 15 frontend tests passing (Total: 41 tests) | ✅ VERIFIED |
| **DevOps** | Containerization & CI/CD | `docker-compose.yml`, `.github/workflows/ci.yml` (automated test & build pipeline) | ✅ VERIFIED |

---

## 🔬 Test Suite Execution Audit

### Backend REST API Test Suite (`server/tests/api.test.ts`)
- **Framework:** Vitest + Supertest
- **Tests Passed:** 26 / 26 (100%)
- **Duration:** < 1.0s
- **Verified Areas:**
  - `POST /api/auth/register` (User registration, password hashing verification)
  - `POST /api/auth/register` (Duplicate email rejection 409)
  - `POST /api/auth/login` (Authentication, JWT issuance)
  - `POST /api/auth/login` (Invalid credentials rejection 401)
  - `GET /api/auth/me` (Token extraction, rejection of unauthenticated requests)
  - `POST /api/pregnancy/profile` (Create profile)
  - `GET /api/pregnancy/profile` (Retrieve profile)
  - `PUT /api/pregnancy/profile` (Update profile)
  - `POST /api/projects` (Create project)
  - `GET /api/projects` (Project listing with dynamic task completion rate)
  - `GET /api/projects/:id` (Owner retrieval)
  - `SECURITY (IDOR)`: Non-owner blocked from viewing project (403 Forbidden)
  - `SECURITY (IDOR)`: Non-owner blocked from deleting project (403 Forbidden)
  - `POST /api/tasks` (Create task under project)
  - `PATCH /api/tasks/:id/complete` (Toggle task completion)
  - `Dynamic Progress`: Verified 100% calculation after task completion
  - `GET /api/doctors` (Search and filtering by specialty and location)
  - `POST /api/appointments` (Schedule simulated appointment)
  - `PATCH /api/appointments/:id/cancel` (Cancel appointment)
  - `GET /api/dashboard` (Live computation of real database statistics)
  - `POST /api/chat` (Emergency Red-Flag Interceptor triage with zero diagnosis)
  - `POST /api/chat` (Educational response with medical disclaimer)
  - `POST /api/chat/ask-doctor` (Question generation for doctor appointment)

### Frontend Unit & Logic Suite (`apps/web/src/__tests__/web.test.ts`)
- **Framework:** Vitest
- **Tests Passed:** 15 / 15 (100%)
- **Duration:** < 20ms
- **Verified Areas:**
  - Login form Zod schema validation
  - Register form Zod schema matching password validation
  - Project creation schema validation
  - Task creation schema validation
  - Dynamic progress calculation logic (0%, 60%, 100%)
  - Task search filtering
  - Task status filtering
  - Task priority filtering
  - Task project association filtering
  - Multi-criteria combined filtering
  - Trimester categorization and progress bounds (Weeks 10, 24, 34)
