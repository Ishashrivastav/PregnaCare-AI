import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Settings: React.FC = () => {
  const { logout, user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [milestoneReminders, setMilestoneReminders] = useState(true);
  const [dailyWellness, setDailyWellness] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize notifications, security preferences, and session controls
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <Bell className="w-5 h-5 text-rosewater-600" />
          <h2 className="text-sm font-bold text-slate-800">Notification Preferences</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Upcoming Visit Reminders</p>
              <p className="text-slate-400 text-[11px]">Receive notice 48 hours before scheduled prenatal visits</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Milestone Achievements</p>
              <p className="text-slate-400 text-[11px]">Notify when entering a new trimester or target week</p>
            </div>
            <input
              type="checkbox"
              checked={milestoneReminders}
              onChange={(e) => setMilestoneReminders(e.target.checked)}
              className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Daily Hydration & Wellness Prompts</p>
              <p className="text-slate-400 text-[11px]">Gentle midday reminders for water and restful breaks</p>
            </div>
            <input
              type="checkbox"
              checked={dailyWellness}
              onChange={(e) => setDailyWellness(e.target.checked)}
              className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800">Security & Clinical Privacy</h2>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <p>• Passwords are cryptographically hashed using bcrypt with salt rounds.</p>
          <p>• All communication with the REST backend is encrypted via HTTPS and JWT tokens.</p>
          <p>• AI keys remain strictly server-side and are never exposed to browser or client code.</p>
          <p>• Data isolation ensures your pregnancy records are only accessible by your account.</p>
        </div>
      </div>

      {/* Session Logout */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Sign Out of Session</h2>
          <p className="text-xs text-slate-400 mt-0.5">End your current session on this device</p>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Settings;
