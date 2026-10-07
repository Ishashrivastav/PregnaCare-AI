# PregnaCare AI - System Architecture

## 1. High-Level Architecture Overview

PregnaCare AI is architected as an enterprise-grade full-stack monorepo designed for high availability, security, and true cross-platform synchronization between Web and Android Mobile clients.

```
                         PREGNACARE AI
                               |
                +--------------+--------------+
                |                             |
                v                             v
          WEB APPLICATION              ANDROID APPLICATION
          React + Vite                 React Native + Expo
          Tailwind CSS + TanStack      Expo SecureStore + Query
                |                             |
                +--------------+--------------+
                               |
                               | (HTTPS / REST API)
                               v
                       REST API BACKEND
                       Node.js + Express + TypeScript
                       Helmet + CORS + Rate Limiter
                               |
                +--------------+--------------+
                |                             |
                v                             v
           Prisma ORM                  AI Safety Layer &
                |                      Server LLM Engine
                v                             |
           PostgreSQL                  Google Gemini API
          (Docker / Cloud)
```

## 2. Key Architecture Principles

1. **Shared Single Backend & Database**:
   - Both Web and Android mobile clients interact with the **exact same** REST API and PostgreSQL database.
   - Any project, task, appointment, or milestone created on Web is immediately visible on Android upon pull-to-refresh, and vice versa.

2. **Defense in Depth**:
   - Authentication via JWT and bcrypt password hashing.
   - Comprehensive input validation using Zod on both client and server boundaries.
   - Ownership verification on all database queries (preventing IDOR attacks).
   - Strict CORS origin policies and Helmet security headers.

3. **Safety-First AI Architecture**:
   - Client applications never access external AI keys.
   - Messages pass through an automated clinical triage filter before reaching the LLM.
   - Urgent pregnancy symptoms trigger immediate escalation guidance without attempting diagnosis.
   - Resilient fallback engine ensures graceful degradation if external LLM APIs are offline.

4. **Monorepo Structure**:
   - `apps/web`: Responsive React 18 SPA built with Vite.
   - `apps/mobile`: React Native 0.74 application built with Expo SDK 51.
   - `server`: Node.js Express TypeScript server with Prisma ORM.
   - `packages/shared-types`: Common TypeScript interfaces and models.
   - `packages/validation`: Zod schemas shared across clients and backend.
   - `docs`: Technical specifications, API references, and security manuals.
