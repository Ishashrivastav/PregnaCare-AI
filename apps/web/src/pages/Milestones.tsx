import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Circle, Calendar, Sparkles } from 'lucide-react';
import api from '../api/client.js';
import { Milestone } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Milestones: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMilestones();
      setMilestones(data || []);
    } catch (err: any) {
      console.error('Failed to load milestones', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await api.toggleMilestone(id);
      fetchMilestones();
    } catch (err: any) {
      alert(err.message || 'Failed to update milestone');
    }
  };

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isLoading) return <CardSkeleton rows={6} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Pregnancy Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Celebrate meaningful clinical and organizational achievements on your journey
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center shadow-sm">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-lavender-50 to-rosewater-50 rounded-3xl p-6 border border-lavender-100/70 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Milestone Journey Completion</span>
          <span className="text-sm font-black text-lavender-700">
            {completedCount} of {totalCount} Achieved ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rosewater-500 to-lavender-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <div className="divide-y divide-slate-100">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => handleToggle(m.id)}
              className="py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50/60 px-3 rounded-2xl transition"
            >
              <button
                type="button"
                className={`mt-0.5 transition ${
                  m.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'
                }`}
              >
                {m.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold ${
                      m.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'
                    }`}
                  >
                    {m.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    Target: Wk {m.targetWeek}
                  </span>
                </div>
                {m.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
                )}
                {m.isCompleted && m.completedAt && (
                  <p className="text-[10px] text-emerald-600 font-semibold pt-0.5">
                    ✓ Completed on {new Date(m.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Milestones;
