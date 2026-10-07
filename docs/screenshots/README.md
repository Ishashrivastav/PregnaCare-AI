# PregnaCare AI — Application Screenshots Directory

This folder is dedicated to visual UI artifacts and high-resolution platform screenshots representing both the **Web Application** and **Android Mobile Application**.

---

## 📸 Standard Screenshot Filenames

When capturing application states for documentation, pull requests, or store listings, use the following standard naming conventions:

| Filename | Platform | Target View / Screen Description |
|---|---|---|
| `dashboard.png` | Web | Executive Dashboard showing Gestational Countdown, Trimester Gauge, Real-Time Stats, and Appointment Cards |
| `projects.png` | Web | Project Management Directory displaying dynamic completion progress bars and status filters |
| `tasks.png` | Web | Task Planning Grid with priority badges (`HIGH`, `MEDIUM`, `LOW`), status toggles, and search filters |
| `pregnancy.png` | Web | Interactive Pregnancy Timeline & Trimester Breakdown |
| `ai-assistant.png` | Web | PregnaCare AI Assistant interface showcasing clinical red-flag triage and educational answers |
| `doctors.png` | Web | Fictional Specialist Directory with specialty & location filtering |
| `appointments.png` | Web | Simulated Consultation Manager with scheduling and cancellation modals |
| `mobile-dashboard.png` | Android | Mobile Dashboard running on Expo with gestational counter and pull-to-refresh |
| `mobile-tasks.png` | Android | Mobile Planning Tab with bottom navigation and quick task creation modal |

---

## 🛠️ How to Capture Screenshots

### Web Application:
1. Ensure the web server is running (`cd apps/web && npm run dev` on `http://localhost:5173`).
2. Log in with the pre-seeded account: `demo@pregnacare.com` / `Password123!`.
3. Set your browser viewport to standard desktop resolution (1920x1080 or 1440x900).
4. Save exported PNGs directly to this directory (`docs/screenshots/`).

### Android Mobile App:
1. Start Expo dev server (`cd apps/mobile && npx expo start`).
2. Open on an Android device via **Expo Go** or an Android Studio Emulator.
3. Capture screenshots and place them in this directory.
