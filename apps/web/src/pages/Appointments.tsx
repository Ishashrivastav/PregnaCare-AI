import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Stethoscope,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import api from '../api/client.js';
import { Appointment } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import EmptyState from '../components/common/EmptyState.js';
import ConfirmModal from '../components/common/ConfirmModal.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAppointments({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setAppointments(data || []);
    } catch (err: any) {
      console.error('Failed to load appointments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleCancel = async (id: string) => {
    try {
      await api.cancelAppointment(id);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.updateAppointment(id, { status: 'COMPLETED' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.deleteAppointment(itemToDelete);
      setItemToDelete(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Appointment Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and organize your simulated prenatal checkups, ultrasounds, and consultations
          </p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition self-start active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Consultation</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-soft border border-slate-100 max-w-fit">
        {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === st
                ? 'bg-rosewater-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Appointments' : st}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={3} />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No appointments found"
          description={
            statusFilter === 'ALL'
              ? 'You have not scheduled any appointments yet. Discover doctors to schedule your first visit.'
              : `No appointments matching status "${statusFilter}".`
          }
          actionText="Find Healthcare Provider"
          onAction={() => (window.location.href = '/doctors')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        appt.status === 'UPCOMING'
                          ? 'bg-sage-100 text-sage-800'
                          : appt.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {appt.status}
                    </span>
                    <h2 className="text-sm font-bold text-slate-800 mt-2">
                      {appt.appointmentType}
                    </h2>
                  </div>

                  <button
                    onClick={() => setItemToDelete(appt.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 py-2 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-rosewater-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {appt.doctor?.name || 'Healthcare Professional'}
                    </span>
                    {appt.doctor?.specialty && (
                      <span className="text-[11px] text-slate-400">({appt.doctor.specialty})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(appt.appointmentDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {appt.appointmentTime}
                    </span>
                  </div>
                  {appt.doctor?.hospitalClinic && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{appt.doctor.hospitalClinic} • {appt.doctor.location}</span>
                    </div>
                  )}
                </div>

                {appt.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl">
                    "{appt.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              {appt.status === 'UPCOMING' && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => handleComplete(appt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Attended</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Appointment Record?"
        message="Are you sure you want to delete this appointment from your personal schedule?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <MedicalDisclaimer />
    </div>
  );
};

export default Appointments;
