# PregnaCare AI - Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o| PregnancyProfile : "maintains"
    User ||--o{ Project : "owns"
    User ||--o{ Task : "assigns"
    User ||--o{ Appointment : "books"
    User ||--o{ Reminder : "schedules"
    User ||--o{ Milestone : "tracks"
    User ||--o{ ChatSession : "initiates"

    Project ||--o{ Task : "contains"
    Doctor ||--o{ Appointment : "conducts"
    ChatSession ||--o{ ChatMessage : "holds"

    User {
        uuid id PK
        string email UK
        string passwordHash
        string fullName
        datetime createdAt
        datetime updatedAt
    }

    PregnancyProfile {
        uuid id PK
        uuid userId FK,UK
        datetime dueDate
        int currentWeek
        datetime startDate
        string preferredDoctor
        string notes
        string importantDates
        datetime createdAt
        datetime updatedAt
    }

    Project {
        uuid id PK
        uuid userId FK
        string name
        string description
        enum status "NOT_STARTED | IN_PROGRESS | COMPLETED"
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }

    Task {
        uuid id PK
        uuid projectId FK
        uuid userId FK
        string name
        string description
        enum priority "LOW | MEDIUM | HIGH"
        enum status "PENDING | IN_PROGRESS | COMPLETED"
        datetime dueDate
        datetime createdAt
        datetime updatedAt
    }

    Doctor {
        uuid id PK
        string name
        string specialty
        string hospitalClinic
        string location
        int experience
        float rating
        string availability
        string profileImage
        string about
        datetime createdAt
        datetime updatedAt
    }

    Appointment {
        uuid id PK
        uuid userId FK
        uuid doctorId FK
        datetime appointmentDate
        string appointmentTime
        string appointmentType
        string notes
        enum status "UPCOMING | COMPLETED | CANCELLED"
        datetime createdAt
        datetime updatedAt
    }

    Reminder {
        uuid id PK
        uuid userId FK
        string title
        string reminderType
        datetime reminderDate
        boolean isCompleted
        datetime createdAt
        datetime updatedAt
    }

    Milestone {
        uuid id PK
        uuid userId FK
        string title
        string description
        int targetWeek
        boolean isCompleted
        datetime completedAt
        datetime createdAt
        datetime updatedAt
    }

    ChatSession {
        uuid id PK
        uuid userId FK
        string title
        datetime createdAt
        datetime updatedAt
    }

    ChatMessage {
        uuid id PK
        uuid chatSessionId FK
        enum role "USER | ASSISTANT | SYSTEM"
        string content
        string concernCategory
        string recommendedDoctorSpecialty
        boolean isSafetyAlert
        datetime createdAt
    }
```

## Relationship & Integrity Rules

1. **Strict User Ownership**:
   - Every user-specific record (`PregnancyProfile`, `Project`, `Task`, `Appointment`, `Reminder`, `Milestone`, `ChatSession`) contains a direct `userId` foreign key.
   - The backend enforces JWT ownership matching on every read, update, and delete operation (preventing Insecure Direct Object References - IDOR).

2. **Cascade Deletions**:
   - Deleting a `User` cascades to delete their `PregnancyProfile`, `Projects`, `Tasks`, `Appointments`, `Reminders`, `Milestones`, and `ChatSessions`.
   - Deleting a `Project` automatically cascades to delete all child `Tasks`.
   - Deleting a `ChatSession` cascades to delete all child `ChatMessages`.

3. **Data Normalization**:
   - `Doctor` is an independent directory model referenced by `Appointment`. Fictional doctors can serve multiple patient appointments.
