import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  Star,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client.js';
import { Doctor } from '../types/index.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';

export const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Form State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [appointmentType, setAppointmentType] = useState('Routine Prenatal Consultation');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.getDoctor(id);
        setDoctor(data);
      } catch (err: any) {
        console.error('Failed to load doctor', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !appointmentDate) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await api.createAppointment({
        doctorId: doctor.id,
        appointmentDate,
        appointmentTime,
        appointmentType,
        notes,
      });
      setSuccessMessage('Consultation scheduled successfully! Added to your appointments.');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CardSkeleton rows={5} />;
  if (!doctor) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl shadow-soft">
        <p className="text-sm font-semibold text-slate-700">Doctor not found</p>
        <Link to="/doctors" className="mt-3 inline-block text-xs font-bold text-rosewater-600">
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rosewater-600 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Specialist Directory</span>
      </Link>

      {/* Doctor Profile Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 flex flex-col sm:flex-row gap-6">
        <img
          src={doctor.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
          alt={doctor.name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover bg-rosewater-50 border border-slate-100 shadow-sm shrink-0"
        />

        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{doctor.name}</h1>
              <p className="text-xs font-semibold text-rosewater-700 mt-0.5">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs self-start">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
              <span className="text-slate-400 font-normal">({doctor.experience} yrs exp)</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.hospitalClinic} • {doctor.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.availability}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-50">
            {doctor.about}
          </p>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-800">Schedule Simulated Appointment</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize and log your upcoming prenatal visits in your personal care calendar
          </p>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleBook} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Time *
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Appointment Type *
            </label>
            <input
              type="text"
              required
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              placeholder="e.g. Routine Prenatal Checkup, Anatomy Ultrasound, Nutrition Consultation"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Discussion Notes & Questions for the Doctor
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mention symptoms to review, blood test questions, or birth plan preferences..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated booking for personal planning</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !appointmentDate}
              className="px-6 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default DoctorDetail;
