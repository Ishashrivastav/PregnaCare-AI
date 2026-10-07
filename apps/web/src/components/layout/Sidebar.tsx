import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  CalendarDays,
  Sparkles,
  Stethoscope,
  Clock,
  HelpCircle,
  FolderKanban,
  CheckSquare,
  Bell,
  Award,
  Apple,
  Activity,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Pregnancy',
      items: [
        { label: 'My Pregnancy', to: '/pregnancy-profile', icon: Heart },
        { label: 'Timeline', to: '/timeline', icon: CalendarDays },
        { label: 'Weekly Information', to: '/weekly-info', icon: Calendar },
      ],
    },
    {
      title: 'Care',
      items: [
        { label: 'Doctors', to: '/doctors', icon: Stethoscope },
        { label: 'Appointments', to: '/appointments', icon: Clock },
        { label: 'Ask Your Doctor', to: '/ask-doctor', icon: HelpCircle },
      ],
    },
    {
      title: 'Planning',
      items: [
        { label: 'Projects', to: '/projects', icon: FolderKanban },
        { label: 'Tasks', to: '/tasks', icon: CheckSquare },
        { label: 'Reminders', to: '/reminders', icon: Bell },
        { label: 'Milestones', to: '/milestones', icon: Award },
      ],
    },
    {
      title: 'Education',
      items: [
        { label: 'Nutrition', to: '/nutrition', icon: Apple },
        { label: 'Wellness', to: '/wellness', icon: Activity },
      ],
    },
    {
      title: 'AI Companion',
      items: [
        { label: 'PregnaCare Assistant', to: '/ai-assistant', icon: Sparkles, badge: 'AI' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', to: '/profile', icon: User },
        { label: 'Settings', to: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 border-r border-rosewater-100/70 select-none shadow-soft">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-rosewater-100/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rosewater-500 to-rosewater-600 flex items-center justify-center text-white shadow-md shadow-rosewater-500/20">
            <Heart className="w-5 h-5 fill-white/30" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none">
              PregnaCare <span className="text-rosewater-600">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Care Companion
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                {section.title}
              </h2>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-rosewater-500 text-white shadow-sm shadow-rosewater-500/25'
                        : 'text-slate-600 hover:bg-rosewater-50/60 hover:text-rosewater-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-rosewater-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-rosewater-100 text-rosewater-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3.5 border-t border-rosewater-100/60 bg-rosewater-50/20">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-rosewater-100 text-rosewater-700 flex items-center justify-center text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0) || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
