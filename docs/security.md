# PregnaCare AI — Security Architecture & Guidelines

PregnaCare AI processes sensitive healthcare organization and personal pregnancy data. The platform adheres to enterprise-grade security practices, strict HIPAA-inspired data privacy standards, and zero-trust ownership validation.

---

## 1. Threat Model & Security Posture

| Threat | Mitigation Mechanism | Verification / Implementation |
|---|---|---|
| **Unauthorized Access & Session Hijacking** | JWT tokens with signed HMAC-SHA256, expiration windows, and non-sensitive payload | `authenticate` middleware, secure Bearer header validation |
| **Credential Theft & Brute Force** | bcrypt 12-round salted hashing, IP-based exponential rate limiting on auth endpoints | `express-rate-limit`, bcryptjs hashing |
| **Insecure Direct Object References (IDOR)** | Dual-predicate query filtering: `where: { id: entityId, userId: tokenUserId }` | Enforced on every Project, Task, Appointment, Milestone, Reminder |
| **SQL Injection & Data Tampering** | Type-safe parameterized queries via Prisma ORM | No raw SQL concatenation; full AST query compilation |
| **Client-Side Token Leakage** | Native keychain encryption on Android (`expo-secure-store`); strict scoped storage on web | Hardware-backed keystore on mobile |
| **Cross-Site Scripting (XSS) & Clickjacking** | HTTP Content Security Policy, X-Frame-Options, Helmet protection | Express `helmet` middleware suite |
| **API Abuse & Denial of Service** | Sliding-window IP rate limiting on chat, login, and registration | 10 req/15min for auth; 20 req/15min for AI chat |
| **Medical Liability & Diagnostic Misinformation** | Rule-based safety triage engine before LLM invocation | Emergency red-flag interceptor + refusal of prescriptions/dosages |

---

## 2. Authentication & Credential Security

### 2.1 Password Storage
- Passwords are never stored or logged in plaintext.
- Every password undergoes a minimum of 12 rounds of bcrypt salt hashing:
  ```typescript
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  ```
- Password policies require a minimum of 8 characters with at least one number and letter.

### 2.2 JWT Token Lifecycle
- Tokens are signed with a cryptographically secure backend secret (`JWT_SECRET`).
- Token payloads contain only non-sensitive identifiers (`id`, `email`, `fullName`).
- Every protected route checks token validity, timestamp freshness, and signature integrity.
- Token expiration returns a structured `401 Unauthorized` response with `TOKEN_EXPIRED` code, allowing clients to purge sessions and redirect gracefully to Login.

---

## 3. Data Ownership & Authorization (IDOR Prevention)

Every user-owned entity (`PregnancyProfile`, `Project`, `Task`, `Appointment`, `Reminder`, `Milestone`, `ChatSession`) contains a non-nullable foreign key to `User.id`.

### Enforced Ownership Architecture:
```
Incoming Request (Bearer JWT)
        │
        ▼
Extract req.user.id from verified JWT
        │
        ▼
Database Query with Compound Predicate:
  prisma.project.findFirst({
    where: {
      id: requestedProjectId,
      userId: req.user.id  <-- Strictly enforced
    }
  })
        │
   ┌────┴────┐
   ▼         ▼
Found    Not Found / Belongs to Other User
(200)    (404 Not Found / 403 Forbidden)
```

No user can access, query, modify, or delete another user's projects, tasks, health logs, or chat transcripts. Tested and verified in automated integration tests (`tests/api.test.ts`).

---

## 4. Input Validation & Sanitization

All incoming request payloads are strictly parsed and validated against shared **Zod** schemas before reaching controller logic:
- Unexpected fields are stripped.
- Field types, string length bounds, enum memberships, and date formats are validated.
- Validation failures trigger standardized `400 Bad Request` responses containing exact field validation issues without exposing internal system details.

---

## 5. Rate Limiting & Denial of Service Protection

Endpoints with high abuse potential or external API costs are protected by `express-rate-limit`:

| Endpoint | Window | Max Requests | Exceeded Response |
|---|---|---|---|
| `/api/auth/login` | 15 minutes | 10 | `429 Too Many Requests (AUTH_RATE_LIMIT)` |
| `/api/auth/register` | 15 minutes | 10 | `429 Too Many Requests (AUTH_RATE_LIMIT)` |
| `/api/chat` | 15 minutes | 20 | `429 Too Many Requests (CHAT_RATE_LIMIT)` |
| Global APIs | 15 minutes | 300 | `429 Too Many Requests (GLOBAL_RATE_LIMIT)` |

---

## 6. Secure Mobile Token Storage

On React Native / Android:
- Tokens are stored using **Expo SecureStore**, which interfaces directly with the Android **Keystore system** (hardware-backed AES encryption).
- Tokens are never written to unencrypted `AsyncStorage` or SQLite plaintext caches.
- On 401 response intercepts, the client invalidates the stored token and transitions the UI to the authentication screen with the message *"Your session has expired. Please log in again."*

---

## 7. HTTP Security Headers & CORS

The backend utilizes `helmet` to set defensive HTTP headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

CORS is strictly configured via `CORS_ORIGIN` environment variable. In production, only authorized front-end domains and local mobile origins are permitted.
