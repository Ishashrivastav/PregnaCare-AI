import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  Sparkles,
  FolderKanban,
  CheckSquare,
  Clock,
  Award,
  ArrowRight,
  Plus,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Baby,
} from 'lucide-react';
import api from '../api/client.js';
import { DashboardStats } from '../types/index.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getTrimesterName = (trim: number) => {
    if (trim === 1) return 'First Trimester (Weeks 1–13)';
    if (trim === 2) return 'Second Trimester (Weeks 14–27)';
    return 'Third Trimester (Weeks 28–40+)';
  };

  const getWeekSizeAnalogy = (week: number) => {
    if (week <= 8) return 'the size of a raspberry 🍇';
    if (week <= 12) return 'the size of a lime 🍋';
    if (week <= 16) return 'the size of an avocado 🥑';
    if (week <= 20) return 'the size of a banana 🍌';
    if (week <= 24) return 'the size of an ear of corn 🌽';
    if (week <= 28) return 'the size of an eggplant 🍆';
    if (week <= 32) return 'the size of a pineapple 🍍';
    if (week <= 36) return 'the size of a papaya 🍈';
    return 'the size of a pumpkin 🎃';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} />
        </div>
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-rose-100 shadow-soft text-center">
        <p className="text-sm font-semibold text-rose-600 mb-4">{error || 'Unable to display dashboard'}</p>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner - Hero Card */}
      <div className="bg-gradient-to-r from-rosewater-500 via-rosewater-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide">
              <Baby className="w-3.5 h-3.5" />
              <span>{getTrimesterName(stats.trimester)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pregnancy Week {stats.currentPregnancyWeek}
            </h1>
            <p className="text-xs sm:text-sm text-rosewater-100 leading-relaxed">
              Baby is currently {getWeekSizeAnalogy(stats.currentPregnancyWeek)}. Keep up the gentle hydration and prenatal routine.
            </p>

            {stats.estimatedDueDate && (
              <p className="text-xs text-white/90 font-medium pt-1">
                Estimated Due Date: <span className="font-bold underline decoration-rosewater-300">{new Date(stats.estimatedDueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                {stats.daysRemaining !== undefined && ` (${stats.daysRemaining} days remaining)`}
              </p>
            )}
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 text-center sm:min-w-[200px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rosewater-200">
              Gestational Progress
            </span>
            <div className="text-3xl font-black mt-1">{stats.pregnancyProgressPercentage}%</div>
            <div className="w-full bg-white/30 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000"
                style={{ width: `${stats.pregnancyProgressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-rosewater-100 mt-2 block">
              Week {stats.currentPregnancyWeek} of 40
            </span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Mandatory Project Management & Care Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Projects</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalProjects}</p>
            <p className="text-[10px] font-semibold text-rosewater-600 mt-1">
              {stats.projectsInProgress} in progress
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rosewater-50 text-rosewater-600 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Care Tasks</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalTasks}</p>
            <p className="text-[10px] font-semibold text-emerald-600 mt-1">
              {stats.completedTasks} completed
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Appointments</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.upcomingAppointments}</p>
            <p className="text-[10px] font-semibold text-sage-600 mt-1">
              {stats.completedAppointments} attended
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Milestones</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.completedMilestones} / {stats.totalMilestones}
            </p>
            <p className="text-[10px] font-semibold text-lavender-600 mt-1">
              {stats.totalMilestones > 0
                ? `${Math.round((stats.completedMilestones / stats.totalMilestones) * 100)}% achieved`
                : 'In progress'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-lavender-50 text-lavender-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Upcoming Tasks & Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks Section */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rosewater-50 text-rosewater-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Priority Pregnancy Tasks</h2>
                  <p className="text-[11px] text-slate-400">Activities needing your attention</p>
                </div>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-bold text-rosewater-600 hover:text-rosewater-700 flex items-center gap-1"
              >
                <span>View all ({stats.pendingTasks})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recentTasks && stats.recentTasks.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {stats.recentTasks.map((task) => (
                  <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : task.priority === 'HIGH'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.name}
                        </p>
                        {task.project && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Project: {task.project.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500">No active tasks right now.</p>
                <Link
                  to="/tasks"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rosewater-50 text-rosewater-700 text-xs font-bold hover:bg-rosewater-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Task</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/ai-assistant"
              className="p-4 rounded-2xl bg-gradient-to-tr from-rosewater-50 to-rose-50 border border-rosewater-100 hover:shadow-soft transition text-center group"
            >
              <Sparkles className="w-5 h-5 text-rosewater-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-xs font-bold text-slate-800">Ask AI</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Symptom advice</p>
            </Link>

            <Link
              to="/projects"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-soft transition text-center group"
            >
              <FolderKanban className="w-5 h-5 text-rosewater-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-xs font-bold text-slate-800">New Project</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Plan care steps</p>
            </Link>

            <Link
              to="/doctors"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-soft transition text-center group"
            >
              <Stethoscope className="w-5 h-5 text-sage-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-xs font-bold text-slate-800">Find Doctor</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Specialist directory</p>
            </Link>

            <Link
              to="/timeline"
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-soft transition text-center group"
            >
              <Calendar className="w-5 h-5 text-lavender-600 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-xs font-bold text-slate-800">Timeline</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Weeks 1 to 40</p>
            </Link>
          </div>
        </div>

        {/* Right Column (1 span): Next Appointment & Next Milestone */}
        <div className="space-y-6">
          {/* Upcoming Appointment Card */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visit</h2>
              <Link to="/appointments" className="text-[11px] font-bold text-rosewater-600 hover:underline">
                View All
              </Link>
            </div>

            {stats.nextAppointment ? (
              <div className="p-4 rounded-2xl bg-sage-50/60 border border-sage-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {stats.nextAppointment.doctor?.name || 'Healthcare Provider'}
                    </h3>
                    <p className="text-[11px] text-sage-800 font-medium">
                      {stats.nextAppointment.appointmentType}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(stats.nextAppointment.appointmentDate).toLocaleDateString()} at{' '}
                      {stats.nextAppointment.appointmentTime}
                    </p>
                  </div>
                </div>

                <Link
                  to="/appointments"
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-[11px] font-bold shadow-sm transition block text-center"
                >
                  Manage Appointment
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">No upcoming appointments scheduled.</p>
                <Link
                  to="/doctors"
                  className="mt-3 inline-block px-3.5 py-1.5 rounded-lg bg-rosewater-600 text-white text-[11px] font-bold hover:bg-rosewater-700 transition"
                >
                  Schedule Consultation
                </Link>
              </div>
            )}
          </div>

          {/* Next Milestone Card */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Milestone</h2>
              <Link to="/milestones" className="text-[11px] font-bold text-rosewater-600 hover:underline">
                Track
              </Link>
            </div>

            {stats.nextMilestone ? (
              <div className="p-4 rounded-2xl bg-lavender-50/60 border border-lavender-100">
                <div className="flex items-center gap-2 text-lavender-700 text-xs font-bold mb-1">
                  <Award className="w-4 h-4" />
                  <span>Target: Week {stats.nextMilestone.targetWeek}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800">{stats.nextMilestone.title}</h3>
                {stats.nextMilestone.description && (
                  <p className="text-[11px] text-slate-500 mt-1">{stats.nextMilestone.description}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">All scheduled milestones achieved! 🎉</p>
            )}
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Dashboard;
