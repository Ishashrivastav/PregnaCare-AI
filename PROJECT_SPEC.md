# PregnaCare AI

## Project Overview

PregnaCare AI is a full-stack pregnancy care management and AI-assisted
healthcare guidance platform.

The system consists of:

1. React web application
2. React Native Expo Android application
3. Node.js + Express REST API
4. PostgreSQL database

The web and mobile applications MUST use the SAME backend and SAME database.

The application provides general educational pregnancy information and
healthcare-professional recommendations.

The AI must NOT diagnose diseases, prescribe medication, or replace a doctor.

---

# AUTHENTICATION

The application must support:

- User registration
- User login
- User logout
- Authentication state
- JWT authentication

User fields:

- Full Name
- Email Address
- Password

Requirements:

- Email addresses must be unique.
- Passwords must be hashed using bcrypt.
- Passwords must never be stored in plaintext.
- Protected APIs require authentication.
- Expired tokens must send the user back to login.
- Users must only access their own data.

Required endpoints:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

---

# PREGNANCY PROFILE

Each mother can maintain a pregnancy profile.

Fields:

- Pregnancy week
- Expected due date
- General pregnancy notes

Required endpoints:

GET /api/pregnancy-profile
POST /api/pregnancy-profile
PUT /api/pregnancy-profile

Use test data only.

---

# PROJECT MANAGEMENT

A Project represents a pregnancy care plan.

Examples:

- First Trimester Care Plan
- Second Trimester Care Plan
- Third Trimester Care Plan
- Prenatal Care Plan

Project fields:

- Project Name
- Description
- Status
- Start Date
- End Date
- Created Date
- User ID

Project statuses:

- Not Started
- In Progress
- Completed

Users must be able to:

- Create projects
- View projects
- Edit projects
- Delete projects
- View only their own projects

Required endpoints:

GET /api/projects
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

---

# TASK MANAGEMENT

Tasks represent pregnancy care activities.

Examples:

- Schedule prenatal appointment
- Complete required test
- Nutrition consultation
- Prepare questions for doctor
- Attend prenatal checkup
- Follow-up consultation

Task fields:

- Task Name
- Description
- Priority
- Status
- Due Date
- Created Date
- Project ID
- User ID

Priority:

- Low
- Medium
- High

Status:

- Pending
- In Progress
- Completed

Users must be able to:

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- View tasks under a project

Required endpoints:

GET /api/tasks
GET /api/tasks/:id
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Users must only access their own tasks.

---

# DASHBOARD

Required dashboard information:

- Total Projects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Projects In Progress

Additional pregnancy information:

- Current pregnancy week
- Upcoming care tasks
- Upcoming appointments
- Recommended healthcare professional

Required endpoint:

GET /api/dashboard

Dashboard data must belong to the authenticated user.

---

# SEARCH AND FILTERING

Projects:

- Search projects by name
- Filter projects by status

Tasks:

- Search tasks by name
- Filter tasks by status
- Filter tasks by priority

---

# AI PREGNANCY CHATBOT

Create an AI assistant called PregnaCare AI.

Required endpoint:

POST /api/chat

The chatbot should:

1. Receive the mother's question.
2. Use pregnancy week when available.
3. Classify the mother's concern.
4. Generate general educational information.
5. Recommend an appropriate healthcare professional category.

Concern categories:

- General Pregnancy
- Pregnancy Symptoms
- Nutrition
- Mental Wellbeing
- Breastfeeding
- Postnatal Care
- Urgent Concern

Healthcare professional categories:

- Obstetrician / Gynecologist
- Prenatal Nutritionist
- Mental Health Professional
- Lactation Consultant

The chatbot MUST:

- Provide general educational information.
- Avoid diagnosing medical conditions.
- Avoid prescribing medication.
- Avoid claiming certainty about medical conditions.
- Recommend professional medical evaluation when appropriate.
- Clearly advise urgent medical care for potentially urgent symptoms.

Every chatbot interface must show:

"PregnaCare AI provides general educational information and is not a
substitute for professional medical advice, diagnosis, or treatment.
For urgent or severe symptoms, seek immediate medical care."

The AI API key must remain on the backend.

It must never be exposed to the frontend.

---

# DOCTOR DIRECTORY

Create fictional/test healthcare professionals.

Doctor fields:

- Name
- Specialization
- Experience
- Location
- Availability
- Description

Specializations:

- Obstetrician / Gynecologist
- Prenatal Nutritionist
- Mental Health Professional
- Lactation Consultant

Required endpoints:

GET /api/doctors
GET /api/doctors/:id

Allow filtering doctors by specialization.

Use TEST DATA ONLY.

---

# APPOINTMENTS

Users can:

- View appointments
- Request appointments
- Edit appointments
- Cancel appointments

Appointment fields:

- Doctor
- User
- Date
- Time
- Reason
- Status

Required endpoints:

GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id

Use test data only.

---

# WEB APPLICATION

Use React.

Pages:

1. Landing Page
2. Register
3. Login
4. Dashboard
5. Projects
6. Project Details
7. Tasks
8. AI Chat
9. Doctors
10. Doctor Details
11. Appointments
12. Pregnancy Profile

Requirements:

- Responsive design
- Proper component structure
- Form validation
- Loading indicators
- Error handling
- Clean user experience
- Protected routes
- Logout
- Search
- Filters
- Empty states

---

# MOBILE APPLICATION

Use React Native with Expo.

Android is required.

Screens:

1. Login
2. Register
3. Dashboard
4. Projects
5. Project Details
6. Tasks
7. AI Chat
8. Doctors
9. Appointments
10. Pregnancy Profile

Requirements:

- SAME backend as web
- SAME PostgreSQL database
- Secure token storage
- Pull-to-refresh
- Loading indicators
- Network error handling
- Expired login handling
- Clean mobile UI

Use Expo SecureStore or equivalent secure storage.

Do NOT store JWT tokens in plain local storage.

---

# DATABASE

Use PostgreSQL.

Use Prisma ORM.

Tables:

- users
- pregnancy_profiles
- projects
- tasks
- doctors
- appointments
- chat_sessions
- chat_messages

Use:

- Primary keys
- Foreign keys
- Relationships
- Normalized design
- Created timestamps

Relationship:

User
  |
  ├── Pregnancy Profile
  |
  ├── Projects
  |      |
  |      └── Tasks
  |
  ├── Chat Sessions
  |      |
  |      └── Chat Messages
  |
  └── Appointments
           |
           └── Doctors

---

# BACKEND

Use:

- Node.js
- Express
- Prisma
- PostgreSQL
- bcrypt
- JWT
- CORS
- Helmet
- Rate limiting
- Input validation
- Request logging

Folder structure:

backend/
  src/
    routes/
    controllers/
    middleware/
    services/
    validators/
    utils/
    config/

Use centralized error handling.

---

# SECURITY

Implement:

- bcrypt password hashing
- JWT authentication
- Authentication middleware
- Authorization
- User ownership checks
- Backend validation
- Email validation
- Enum validation
- Date validation
- SQL injection protection through Prisma
- Rate limiting on authentication endpoints
- CORS
- Helmet
- Safe error responses
- No passwords in API responses
- No API keys in frontend

---

# ENVIRONMENT VARIABLES

Backend:

DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
CLIENT_URL=
PORT=

Never commit .env.

Create .env.example.

---

# DOCUMENTATION

Create:

README.md

docs/API.md

docs/ER-DIAGRAM.md

Documentation must include:

- Project overview
- Architecture
- Setup instructions
- Environment variables
- Database setup
- API documentation
- Web setup
- Mobile setup
- Deployment
- Mobile connection to deployed backend
- Security decisions
- Test credentials

---

# DEPLOYMENT

Prepare:

- PostgreSQL deployment
- Backend deployment
- Web deployment
- Android APK

Production mobile configuration must use the deployed backend URL.

Do not use localhost in production mobile configuration.

---

# TESTING

Test:

- Registration
- Login
- Logout
- Invalid login
- Protected routes
- Project CRUD
- Task CRUD
- Dashboard
- Search
- Filters
- Pregnancy profile
- AI chatbot
- Doctor recommendation
- Doctor directory
- Appointments
- User authorization
- Mobile login
- Mobile API
- Pull-to-refresh
- Network errors
- Expired token

---

# PRIORITY

The most important goal is a working application.

Do NOT spend time on optional bonus features until every required feature works.

Do not add unnecessary complexity.

Use only fictional/test healthcare data.

The application should be easy for another developer to run and understand.