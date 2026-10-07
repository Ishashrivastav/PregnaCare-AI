import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client.js';
import { Reminder } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import EmptyState from '../components/common/EmptyState.js';
import ConfirmModal from '../components/common/ConfirmModal.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Reminder Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('APPOINTMENT');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReminders();
      setReminders(data || []);
    } catch (err: any) {
      console.error('Failed to load reminders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await api.toggleReminder(id);
      fetchReminders();
    } catch (err: any) {
      alert(err.message || 'Failed to update reminder');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    setIsSubmitting(true);
    try {
      await api.createReminder({
        title: newTitle,
        reminderType: newType,
        reminderDate: newDate,
      });
      setNewTitle('');
      setNewDate('');
      setShowAddModal(false);
      fetchReminders();
    } catch (err: any) {
      alert(err.message || 'Failed to create reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reminderToDelete) return;
    try {
      await api.deleteReminder(reminderToDelete.id);
      setReminderToDelete(null);
      fetchReminders();
    } catch (err: any) {
      alert(err.message || 'Failed to delete reminder');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Reminders & Daily Prompts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organizational check-ins for appointments, hydration, and doctor visit questions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition self-start active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-2xl text-[11px] text-amber-800 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Note: PregnaCare AI does not generate or manage medication dosages. All schedule reminders are user-entered organizational aids.
        </span>
      </div>

      {isLoading ? (
        <CardSkeleton rows={4} />
      ) : reminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No active reminders"
          description="Create your first reminder for your next prenatal visit, hydration target, or doctor questions."
          actionText="Create Reminder"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 divide-y divide-slate-100">
          {reminders.map((r) => (
            <div key={r.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={r.isCompleted}
                  onChange={() => handleToggle(r.id)}
                  className="w-4 h-4 text-rosewater-600 rounded focus:ring-rosewater-400 cursor-pointer"
                />
                <div>
                  <p
                    className={`text-xs font-semibold ${
                      r.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {r.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-rosewater-700 bg-rosewater-50 px-2 py-0.5 rounded-md">
                      {r.reminderType}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(r.reminderDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setReminderToDelete(r)}
                className="p-1 rounded-lg text-slate-300 hover:text-rose-600 transition"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Create New Reminder</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Discuss birth plan with Dr. Vance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                  >
                    <option value="APPOINTMENT">Appointment</option>
                    <option value="DAILY_WELLNESS">Daily Wellness</option>
                    <option value="HYDRATION">Hydration</option>
                    <option value="DOCTOR_QUESTIONS">Doctor Questions</option>
                    <option value="PREPARATION">Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim() || !newDate}
                  className="px-5 py-2 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!reminderToDelete}
        title="Delete Reminder?"
        message={`Delete "${reminderToDelete?.title}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setReminderToDelete(null)}
      />

      <MedicalDisclaimer />
    </div>
  );
};

export default Reminders;
