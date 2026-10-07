# PregnaCare AI - Database Documentation

## 1. Schema Design & ORM

PregnaCare AI uses **Prisma ORM** with **PostgreSQL** in production/Docker, and provides an automatic SQLite development fallback for environments without Docker.

### Data Models & Relationships

1. **User (`users`)**:
   - `id`: UUID Primary Key
   - `email`: Unique lowercase email string
   - `passwordHash`: Salted bcrypt hash (rounds = 10). Never returned in API responses.
   - `fullName`: Expecting mother's name
   - `createdAt`, `updatedAt`: Timestamps

2. **PregnancyProfile (`pregnancy_profiles`)**:
   - `userId`: Foreign key to `User` (1-to-1 relationship, Unique)
   - `dueDate`: Expected date of delivery
   - `currentWeek`: Integer (1 to 42)
   - `startDate`: Last menstrual period or conception reference date
   - `preferredDoctor`: Preferred provider name
   - `notes`: Personal observations and notes

3. **Project (`projects`)**:
   - `userId`: Foreign key to `User` (Ownership constraint)
   - `name`: Title of care plan (e.g. "Hospital Preparation")
   - `description`: Narrative details
   - `status`: Enum (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`)
   - `startDate`, `endDate`: Timeline bounds

4. **Task (`tasks`)**:
   - `projectId`: Foreign key to `Project` (Cascade delete on project removal)
   - `userId`: Direct ownership foreign key to `User`
   - `name`: Action item (e.g. "Pack delivery bag")
   - `priority`: Enum (`LOW`, `MEDIUM`, `HIGH`)
   - `status`: Enum (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
   - `dueDate`: Optional completion target date

5. **Doctor (`doctors`)**:
   - Fictional demonstration directory of healthcare specialists across OB/GYN, Maternal-Fetal Medicine, Prenatal Nutrition, Lactation, and Perinatal Mental Health.

6. **Appointment (`appointments`)**:
   - `userId`: Foreign key to `User`
   - `doctorId`: Foreign key to `Doctor`
   - `appointmentDate`, `appointmentTime`: Scheduled slot
   - `appointmentType`: Clinical description
   - `status`: Enum (`UPCOMING`, `COMPLETED`, `CANCELLED`)

7. **Reminder (`reminders`)**:
   - `userId`: Foreign key to `User`
   - `title`: Reminder prompt
   - `reminderType`: Category
   - `reminderDate`: Scheduled date
   - `isCompleted`: Boolean checkoff

8. **Milestone (`milestones`)**:
   - `userId`: Foreign key to `User`
   - `title`: Milestone name (e.g. "Anatomy Ultrasound Scan")
   - `targetWeek`: Gestational target (1 to 42)
   - `isCompleted`: Boolean flag
   - `completedAt`: Achievement timestamp

9. **ChatSession (`chat_sessions`) & ChatMessage (`chat_messages`)**:
   - Holds historical conversations with PregnaCare AI Assistant.
   - Tags messages with `concernCategory`, `recommendedDoctorSpecialty`, and `isSafetyAlert`.

## 2. Dynamic Progress Calculation

Project progress is dynamically calculated via database aggregations:
$$\text{Progress} = \text{round}\left(\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\right)$$
If a project has 0 tasks, progress is 0%. No hardcoded numbers are ever used.
