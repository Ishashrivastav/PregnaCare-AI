# PregnaCare AI — Deployment & DevOps Guide

This guide covers deployment procedures for PregnaCare AI across all three tiers: PostgreSQL Database, Node.js REST API Backend, React Web Application, and Expo Android Mobile Application.

---

## 1. Prerequisites & Environment Architecture

```
                                  INTERNET
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
           CloudFront / Vercel                      Google Play Store
            (Web App Bundle)                         (Android App)
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼ HTTPS
                           Reverse Proxy (Nginx)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
          Node.js REST Backend                  Health Check / Monitoring
            Docker Container                       `GET /api/health`
                   │
                   ▼ (Port 5432)
         Managed PostgreSQL DB
           (RDS / Neon / Local)
```

---

## 2. Docker Compose Deployment (Recommended for Self-Hosting)

The repository provides a root `docker-compose.yml` defining the containerized PostgreSQL database and backend server.

### 2.1 Starting Services
```bash
# 1. Clone the repository and configure environment variables
cp .env.example .env

# 2. Launch PostgreSQL and REST Backend containers in detached mode
docker compose up -d --build

# 3. View live runtime logs
docker compose logs -f backend
```

### 2.2 Database Initialization in Docker
```bash
# Execute Prisma migrations inside the running container
docker compose exec backend npx prisma migrate deploy

# Seed initial fictional doctors and test demo users
docker compose exec backend npx prisma db seed
```

### 2.3 Stopping Services
```bash
docker compose down -v # Remove containers and volumes (or omit -v to keep database state)
```

---

## 3. Manual / Bare-Metal Deployment

### 3.1 Backend Server (Node.js)
```bash
cd server

# Install production dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build TypeScript to production JavaScript
npm run build

# Start production server
NODE_ENV=production npm start
```

### 3.2 Web Frontend (React + Vite)
```bash
cd apps/web

# Install dependencies
npm ci

# Configure production API endpoint
export VITE_API_URL="https://api.yourdomain.com"

# Build optimized production bundle
npm run build
```
The output directory `apps/web/dist` can be served via Nginx, AWS S3 + CloudFront, or Vercel.

**Example Nginx Configuration for Single-Page Application (SPA):**
```nginx
server {
    listen 80;
    server_name pregnacare.yourdomain.com;

    root /var/www/pregnacare-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Android Mobile Build (Expo / EAS)

The mobile application is powered by Expo SDK 51 and configured for Android builds via EAS (Expo Application Services).

### 4.1 Local Development Run
```bash
cd apps/mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```
Scan the QR code with the Expo Go app on an Android device or launch in an Android Studio emulator.

### 4.2 Building Production Android APK / AAB
```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to Expo account
eas login

# 3. Configure EAS project
eas build:configure

# 4. Build preview APK for testing on physical devices
eas build --platform android --profile preview

# 5. Build production App Bundle (AAB) for Google Play Store release
eas build --platform android --profile production
```

### 4.3 Environment Configuration for Mobile
In `apps/mobile/src/api/client.ts`, configure `EXPO_PUBLIC_API_URL` to point to your live backend domain or local network IP (`http://<YOUR_LAN_IP>:5000`) when testing on physical devices.

---

## 5. Health Monitoring & Verification

Validate that the backend is responding correctly:
```bash
curl -i http://localhost:5000/api/health
```

**Expected 200 OK Response:**
```json
{
  "success": true,
  "message": "PregnaCare AI API is running",
  "timestamp": "2026-10-07T16:00:00.000Z"
}
```

---

## 6. Production Security Checklist

- [ ] `NODE_ENV` is set to `production`.
- [ ] `JWT_SECRET` is set to a 64-character high-entropy random string.
- [ ] `CORS_ORIGIN` is restricted to authorized production domains.
- [ ] `LLM_API_KEY` is securely stored in backend environment variables and never exposed to clients.
- [ ] Automated automated database backups (pg_dump / RDS snapshots) are scheduled.
- [ ] SSL/TLS certificates configured via Let's Encrypt / Certbot.
