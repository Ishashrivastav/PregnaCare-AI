import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, Calendar, Stethoscope, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/client.js';
import { PregnancyProfile as IPregnancyProfile } from '../types/index.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';

export const PregnancyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IPregnancyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      dueDate: '',
      currentWeek: 1,
      startDate: '',
      preferredDoctor: '',
      notes: '',
    },
  });

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProfile();
      if (data) {
        setProfile(data);
        reset({
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          currentWeek: data.currentWeek || 1,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          preferredDoctor: data.preferredDoctor || '',
          notes: data.notes || '',
        });
      }
    } catch (err: any) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const updated = await api.updateProfile(values);
      setProfile(updated);
      setSuccessMessage('Pregnancy profile saved successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save pregnancy profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <CardSkeleton rows={6} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            My Pregnancy Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your pregnancy timeline, due date, and personalized care notes
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rosewater-50 text-rosewater-600 flex items-center justify-center shadow-sm">
          <Heart className="w-5 h-5 fill-rosewater-200" />
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Estimated Due Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="date"
                required
                {...register('dueDate')}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
              />
            </div>
          </div>

          {/* Current Week */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Current Pregnancy Week (1–42) *
            </label>
            <input
              type="number"
              min="1"
              max="42"
              required
              {...register('currentWeek', { valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pregnancy Start / Last Period Date
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>

          {/* Preferred Doctor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Healthcare Provider / Clinic
            </label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                {...register('preferredDoctor')}
                placeholder="e.g. Dr. Evelyn Vance, MD"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
              />
            </div>
          </div>
        </div>

        {/* General Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            General Pregnancy Notes & Observations
          </label>
          <textarea
            rows={4}
            {...register('notes')}
            placeholder="Record symptoms, ultrasound notes, vitamins, questions, or feelings..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving profile...' : 'Save Pregnancy Profile'}</span>
          </button>
        </div>
      </form>

      <MedicalDisclaimer />
    </div>
  );
};

export default PregnancyProfilePage;
