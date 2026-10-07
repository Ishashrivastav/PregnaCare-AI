import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Heart,
  Activity,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Timeline: React.FC = () => {
  const [activeTrimester, setActiveTrimester] = useState<number>(2);

  const trimesterData = [
    {
      trimester: 1,
      weeks: 'Weeks 1–13',
      name: 'First Trimester',
      subtitle: 'The Beginning of Life & Organogenesis',
      babyDev:
        'Rapid cellular division, neural tube formation, early heart tube pulsations, and development of limb buds and facial features. By week 12, all major organs and systems have formed.',
      motherChanges:
        'Elevated hCG, progesterone, and estrogen. Common symptoms include mild nausea, heightened sense of smell, fatigue, frequent urination, and breast tenderness.',
      wellness: [
        'Take a daily prenatal multivitamin containing 400–800 mcg of folic acid.',
        'Prioritize 8–9 hours of sleep and rest when fatigue peaks.',
        'Consume small, frequent nutrient-dense meals to soothe morning nausea.',
        'Stay hydrated with water, infused water, or electrolyte-rich broths.',
      ],
      questions: [
        'When should we schedule the initial dating and viability ultrasound?',
        'What prenatal genetic screening options (NIPT, nuchal translucency) are recommended?',
        'Which over-the-counter nausea relief or vitamins are safest for my medical history?',
      ],
    },
    {
      trimester: 2,
      weeks: 'Weeks 14–27',
      name: 'Second Trimester',
      subtitle: 'Growth, Quickening & Renewed Energy',
      babyDev:
        'Bone ossification accelerates, fine lanugo hair covers the skin, and hearing begins. Baby starts moving actively (quickening, often felt between weeks 18–22). Eyebrows and fingernails form.',
      motherChanges:
        'Often called the energetic trimester. Morning sickness typically improves. Abdomen expands, round ligament stretching may cause mild groin twinges, and appetite often increases.',
      wellness: [
        'Practice side-sleeping (preferably left side) with supportive pillows.',
        'Engage in gentle low-impact exercises: prenatal yoga, swimming, walking.',
        'Maintain iron-rich meals (spinach, beans, lean meats) paired with vitamin C.',
        'Schedule your comprehensive mid-pregnancy anatomy ultrasound (weeks 18–22).',
      ],
      questions: [
        'How did the mid-pregnancy anatomy ultrasound measurements look?',
        'When should I complete the glucose screening test for gestational diabetes?',
        'Are round ligament stretches or abdominal support bands appropriate for my discomfort?',
      ],
    },
    {
      trimester: 3,
      weeks: 'Weeks 28–40+',
      name: 'Third Trimester',
      subtitle: 'Maturation, Nesting & Birth Readiness',
      babyDev:
        'Substantial weight gain, brain tissue folding, lung surfactant production, and fat deposition. Baby prepares for birth by settling into a head-down (cephalic) position.',
      motherChanges:
        'Increased abdominal weight and pressure on pelvic joints. Frequent Braxton Hicks practice contractions, mild ankle edema, shortness of breath as diaphragm elevates, and frequent urination.',
      wellness: [
        'Monitor regular fetal movement daily (kick counts during active periods).',
        'Pack hospital bags and review birth preferences with your care team.',
        'Take childbirth and infant CPR education classes.',
        'Install and inspect your rear-facing infant vehicle safety seat.',
      ],
      questions: [
        'What are the signs of labor vs. Braxton Hicks practice contractions?',
        'When should I contact the hospital or clinic after contractions begin or water breaks?',
        'What is your protocol for Group B Strep (GBS) screening and birth preferences?',
      ],
    },
  ];

  const current = trimesterData.find((t) => t.trimester === activeTrimester) || trimesterData[1];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          Pregnancy Timeline
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Educational exploration of developmental milestones and maternal changes across each trimester
        </p>
      </div>

      {/* Trimester Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {trimesterData.map((t) => (
          <button
            key={t.trimester}
            onClick={() => setActiveTrimester(t.trimester)}
            className={`p-4 rounded-2xl text-left transition-all border ${
              activeTrimester === t.trimester
                ? 'bg-rosewater-600 text-white shadow-soft-lg border-rosewater-600'
                : 'bg-white hover:bg-rosewater-50/40 text-slate-700 border-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                activeTrimester === t.trimester ? 'text-rosewater-200' : 'text-slate-400'
              }`}
            >
              {t.weeks}
            </span>
            <p className="text-sm font-extrabold mt-1">{t.name}</p>
          </button>
        ))}
      </div>

      {/* Trimester Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-rosewater-600 uppercase tracking-wider">
            {current.weeks} Overview
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-1">{current.subtitle}</h2>
        </div>

        {/* Baby Development & Maternal Changes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-rosewater-50/50 border border-rosewater-100/70 space-y-2">
            <div className="flex items-center gap-2 text-rosewater-700 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Baby's Development</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.babyDev}</p>
          </div>

          <div className="p-5 rounded-2xl bg-sage-50/50 border border-sage-100/70 space-y-2">
            <div className="flex items-center gap-2 text-sage-700 font-bold text-xs">
              <Heart className="w-4 h-4" />
              <span>Mother's Physical Changes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.motherChanges}</p>
          </div>
        </div>

        {/* Wellness Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>General Wellness Guidance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {current.wellness.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Questions to Discuss with Healthcare Providers */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-lavender-600" />
            <span>Questions to Discuss with Your Doctor</span>
          </div>
          <div className="space-y-2">
            {current.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-lavender-50/50 border border-lavender-100 text-xs text-slate-700 font-medium flex items-center justify-between"
              >
                <span>• {q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Timeline;
