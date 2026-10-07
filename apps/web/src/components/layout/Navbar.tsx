import React, { useState } from 'react';
import { Menu, Bell, Sparkles, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Link } from 'react-router-dom';

interface Props {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Upcoming Prenatal Visit', desc: 'Routine checkup scheduled in 5 days', time: 'Today' },
    { id: 2, title: 'Milestone Completed', desc: 'Anatomy scan marked completed', time: 'Yesterday' },
    { id: 3, title: 'Hydration Reminder', desc: 'Remember to drink water today', time: '2h ago' },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-rosewater-100/70 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-rosewater-50 hover:text-rosewater-700 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-semibold text-slate-500">Welcome back,</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
            {user?.fullName || 'Expecting Mother'} 👋
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ask AI Quick Link */}
        <Link
          to="/ai-assistant"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rosewater-50 border border-rosewater-200/60 text-rosewater-700 hover:bg-rosewater-100 text-xs font-bold transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask PregnaCare AI</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-rosewater-50 hover:text-rosewater-700 transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rosewater-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-3 z-50 animate-fadeIn">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-rosewater-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rosewater-400 to-rosewater-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {user?.fullName?.charAt(0) || 'M'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
