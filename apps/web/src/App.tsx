import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext.js';
import Layout from './components/layout/Layout.js';

// Public Pages
import LandingPage from './pages/LandingPage.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

// Authenticated Pages
import Dashboard from './pages/Dashboard.js';
import PregnancyProfilePage from './pages/PregnancyProfile.js';
import Timeline from './pages/Timeline.js';
import WeeklyInfo from './pages/WeeklyInfo.js';
import AIAssistant from './pages/AIAssistant.js';
import AskDoctor from './pages/AskDoctor.js';
import Doctors from './pages/Doctors.js';
import DoctorDetail from './pages/DoctorDetail.js';
import Appointments from './pages/Appointments.js';
import Projects from './pages/Projects.js';
import ProjectDetail from './pages/ProjectDetail.js';
import Tasks from './pages/Tasks.js';
import Reminders from './pages/Reminders.js';
import Milestones from './pages/Milestones.js';
import Nutrition from './pages/Nutrition.js';
import Wellness from './pages/Wellness.js';
import Profile from './pages/Profile.js';
import Settings from './pages/Settings.js';
import NotFound from './pages/NotFound.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f8]">
        <div className="w-8 h-8 rounded-full border-3 border-rosewater-200 border-t-rosewater-600 animate-spin" />
      </div>
    );
  }

  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pregnancy-profile" element={<PregnancyProfilePage />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/weekly-info" element={<WeeklyInfo />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/ask-doctor" element={<AskDoctor />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
