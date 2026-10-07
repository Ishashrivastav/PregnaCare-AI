import React from 'react';
import { Activity, Moon, Heart, Smile, Sparkles, AlertCircle } from 'lucide-react';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Wellness: React.FC = () => {
  const wellnessPillars = [
    {
      icon: Moon,
      title: 'Sleep Ergonomics & Rest',
      description:
        'As pregnancy progresses, sleeping on your left side optimizes blood flow from the inferior vena cava to the heart, kidneys, and fetus. Use maternity pillows between your knees and along your back for spine alignment.',
    },
    {
      icon: Activity,
      title: 'Gentle Physical Movement',
      description:
        'Engage in 150 minutes of moderate-intensity prenatal exercise weekly if cleared by your provider. Excellent choices include brisk walking, prenatal swimming, stationary cycling, and gentle prenatal yoga.',
    },
    {
      icon: Heart,
      title: 'Pelvic Floor Care',
      description:
        'Strengthening and relaxing the pelvic floor muscles (Kegels and diaphragmatic breathing) supports bladder control, reduces pelvic joint strain, and prepares muscles for labor and postpartum healing.',
    },
    {
      icon: Smile,
      title: 'Emotional Well-Being & Stress Reduction',
      description:
        'Hormonal changes naturally affect mood. Practice mindfulness, deep box breathing (4s in, 4s hold, 4s out), journaling, and stay connected with your support network or perinatal mental health counselors.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Maternal Wellness & Self-Care
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic, evidence-based practices for physical vitality, restful sleep, and emotional peace
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center shadow-sm">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {wellnessPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-sage-50 text-sage-700 flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">{p.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
            </div>
          );
        })}
      </div>

      {/* Box breathing exercise card */}
      <div className="bg-gradient-to-r from-sage-50 to-warm-50 rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 text-sage-800 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sage-600" />
          <span>Quick Relaxation Exercise</span>
        </div>
        <h2 className="text-base font-black text-slate-800">
          Diaphragmatic 4-4-4 Reset Breath
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white border border-sage-100">
            <span className="text-xs font-black text-sage-700">1. Inhale</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Deeply for 4 seconds</p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-sage-100">
            <span className="text-xs font-black text-sage-700">2. Pause</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Gentle 4-second hold</p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-sage-100">
            <span className="text-xs font-black text-sage-700">3. Exhale</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Slowly for 4 seconds</p>
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Wellness;
