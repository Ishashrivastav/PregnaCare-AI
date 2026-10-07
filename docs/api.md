# PregnaCare AI - REST API Documentation

All API endpoints return standard JSON responses:

**Success Response (200, 201):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response (400, 401, 403, 404, 409, 422, 429, 500):**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errorCode": "ERROR_CODE_IDENTIFIER"
}
```

---

## 1. System & Health

### `GET /api/health`
Returns system operational status and timestamp.
- **Auth**: None

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new expecting mother user account.
- **Rate Limited**: 30 req / 15 min
- **Body**: `{ fullName, email, password, confirmPassword }`
- **Returns**: `{ user, token }`

### `POST /api/auth/login`
Authenticates user and returns signed JWT.
- **Rate Limited**: 30 req / 15 min
- **Body**: `{ email, password }`
- **Returns**: `{ user, token }`

### `POST /api/auth/logout`
Logs out active session.
- **Auth**: Bearer JWT

### `GET /api/auth/me`
Retrieves currently authenticated user and active pregnancy profile.
- **Auth**: Bearer JWT

---

## 3. Pregnancy Profile (`/api/pregnancy` & `/api/pregnancy-profile`)

- `GET /api/pregnancy/profile`: Returns pregnancy profile for current user.
- `POST /api/pregnancy/profile`: Creates profile `{ dueDate, currentWeek, preferredDoctor, notes }`.
- `PUT /api/pregnancy/profile`: Updates profile attributes.

---

## 4. Projects (`/api/projects`)

- `GET /api/projects`: List user's pregnancy projects with dynamically calculated progress. Supports query params `?search=...&status=...`.
- `GET /api/projects/:id`: Get project details and child tasks (Strict ownership enforced).
- `POST /api/projects`: Create project `{ name, description, status, startDate, endDate }`.
- `PUT /api/projects/:id`: Update project details.
- `DELETE /api/projects/:id`: Delete project and cascade delete child tasks.

---

## 5. Care Tasks (`/api/tasks`)

- `GET /api/tasks`: List user's care tasks. Filters: `?projectId=...&status=...&priority=...&search=...`.
- `GET /api/tasks/:id`: Get task by ID (Strict ownership enforced).
- `POST /api/tasks`: Create task `{ projectId, name, description, priority, dueDate }`.
- `PUT /api/tasks/:id`: Update task attributes.
- `PATCH /api/tasks/:id/complete`: Toggle completion status (`PENDING` <-> `COMPLETED`).
- `DELETE /api/tasks/:id`: Delete task.

---

## 6. Doctor Directory (`/api/doctors`)

- `GET /api/doctors`: Search and filter fictional specialists `?search=...&specialty=...&location=...`.
- `GET /api/doctors/:id`: Retrieve doctor profile.

---

## 7. Appointments (`/api/appointments`)

- `GET /api/appointments`: List user's scheduled visits. Supports `?status=...&date=...`.
- `POST /api/appointments`: Schedule simulated consultation `{ doctorId, appointmentDate, appointmentTime, appointmentType, notes }`.
- `PUT /api/appointments/:id`: Update appointment slot or details.
- `PATCH /api/appointments/:id/cancel`: Set appointment status to `CANCELLED`.
- `DELETE /api/appointments/:id`: Delete appointment record.

---

## 8. Reminders & Milestones (`/api/reminders`, `/api/milestones`)

- `GET /api/reminders`: List reminders.
- `POST /api/reminders`: Create reminder `{ title, reminderType, reminderDate }`.
- `PATCH /api/reminders/:id/toggle`: Toggle reminder completion.
- `DELETE /api/reminders/:id`: Delete reminder.
- `GET /api/milestones`: List milestones (automatically seeded for new users).
- `PATCH /api/milestones/:id/toggle`: Toggle milestone completion.

---

## 9. AI Assistant & Visit Preparation (`/api/chat`)

### `POST /api/chat`
Safety-first pregnancy guidance assistant.
- **Rate Limited**: 40 req / 5 min
- **Body**: `{ message, sessionId?, currentWeek? }`
- **Response**: `{ sessionId, message, isUrgent, category, recommendedSpecialty, disclaimer }`
- **Safety Triage**: Acute symptoms (severe bleeding, acute abdominal pain, vision loss, fluid leakage) immediately return clinical escalation instructions without medical diagnosis or prescription!

### `POST /api/chat/ask-doctor`
Generates structured questions for upcoming clinic visits based on user symptoms.
- **Body**: `{ concern, currentWeek? }`
- **Response**: `{ summary, suggestedQuestions, specialtyRecommendation, warningSignsToWatch }`

---

## 10. Dashboard Statistics (`/api/dashboard`)

### `GET /api/dashboard`
Returns real, database-derived statistics for the authenticated mother:
```json
{
  "totalProjects": 3,
  "totalTasks": 8,
  "completedTasks": 5,
  "pendingTasks": 3,
  "projectsInProgress": 2,
  "currentPregnancyWeek": 24,
  "trimester": 2,
  "estimatedDueDate": "2027-01-15T00:00:00.000Z",
  "daysRemaining": 112,
  "pregnancyProgressPercentage": 60,
  "upcomingAppointments": 1,
  "completedAppointments": 2,
  "upcomingTasks": 3,
  "completedMilestones": 5,
  "totalMilestones": 8
}
```
