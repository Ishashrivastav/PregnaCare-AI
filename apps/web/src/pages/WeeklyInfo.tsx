import React, { useState } from 'react';
import {
  Calendar,
  Baby,
  Heart,
  Apple,
  Moon,
  Activity,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

interface WeekContent {
  size: string;
  weight: string;
  length: string;
  babyDev: string;
  momChanges: string;
  nutrition: string;
  sleep: string;
  exercise: string;
  doctorQuestion: string;
}

export const WeeklyInfo: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(24);

  const getWeekData = (week: number): WeekContent => {
    if (week <= 13) {
      return {
        size: 'size of a peach 🍑',
        weight: '~25 grams',
        length: '~7.5 cm (crown to rump)',
        babyDev:
          'Major anatomical structures are forming. Vocal cords and finger prints develop, facial features refine, and tiny kidneys begin producing urine into the amniotic fluid.',
        momChanges:
          'Hormonal shifts may cause fatigue, morning nausea, breast swelling, and food aversions. Uterus expands above the pelvic bone toward week 12.',
        nutrition:
          'Ensure regular intake of folic acid (400–800 mcg) and vitamin B6 to manage mild nausea. Sip ginger tea and consume small frequent snacks.',
        sleep:
          'Rest proactively. Early pregnancy increases metabolic demands. Midday 20-minute power naps can restore energy.',
        exercise:
          'Gentle walking and low-impact prenatal movements help support circulation and reduce sluggish digestion.',
        doctorQuestion:
          'Are there specific baseline genetic screenings or prenatal blood panels recommended for my age and history?',
      };
    } else if (week <= 27) {
      return {
        size: 'size of an ear of corn 🌽',
        weight: '~600 grams',
        length: '~30 cm',
        babyDev:
          'Baby has developed hearing, distinct sleep-wake cycles, and nostrils opening for practice breathing motions. Wrinkled skin begins smoothing with subcutaneous fat deposits.',
        momChanges:
          'Abdomen expands visibly. Round ligament discomfort, back tension, and quickening movements are commonly noticed.',
        nutrition:
          'Emphasize iron, calcium, and protein. Snack on Greek yogurt, pumpkin seeds, lentils, and citrus fruits.',
        sleep:
          'Sleep on your side with a contour pillow under your belly and between your knees to alleviate back strain.',
        exercise:
          'Prenatal yoga, pelvic tilts, and swimming are excellent for strengthening pelvic floor muscles and relieving joint stress.',
        doctorQuestion:
          'What are the details of the upcoming 1-hour glucose challenge screening test for gestational diabetes?',
      };
    } else {
      return {
        size: 'size of a honeydew melon 🍈',
        weight: '~2.2 kg',
        length: '~45 cm',
        babyDev:
          'Lungs are reaching surfactant maturity, immune antibodies are transferred from mother, and brain development accelerates rapidly. Baby practices sucking and blinking.',
        momChanges:
          'Shortness of breath may occur as the uterus compresses the diaphragm. Mild ankle swelling, frequent urination, and irregular Braxton Hicks contractions are common.',
        nutrition:
          'Include healthy omega-3 fatty acids (DHA/EPA from safe cooked fish or algae) for infant brain and retina development.',
        sleep:
          'Elevate your head and upper chest with extra pillows if experiencing heartburn, and stay cool.',
        exercise:
          'Gentle walking and pelvic floor exercises (Kegels) support stamina for labor and postpartum recovery.',
        doctorQuestion:
          'What are the specific parameters (contraction frequency, water break) for when I should report to the labor and delivery department?',
      };
    }
  };

  const currentData = getWeekData(selectedWeek);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Weekly Pregnancy Guide
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore week-by-week developmental updates, anatomical progress, and clinical self-care
          </p>
        </div>

        {/* Week Selector Controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
            disabled={selectedWeek <= 1}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rosewater-600" />
            <span>Week {selectedWeek}</span>
          </div>
          <button
            onClick={() => setSelectedWeek((w) => Math.min(40, w + 1))}
            disabled={selectedWeek >= 40}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Selector Slider / Badges */}
      <div className="bg-white p-4 rounded-3xl shadow-soft border border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max pb-1">
          {Array.from({ length: 40 }).map((_, i) => {
            const weekNum = i + 1;
            const isSelected = selectedWeek === weekNum;
            return (
              <button
                key={weekNum}
                onClick={() => setSelectedWeek(weekNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  isSelected
                    ? 'bg-rosewater-600 text-white shadow-md shadow-rosewater-600/30'
                    : 'text-slate-600 hover:bg-rosewater-50 hover:text-rosewater-700'
                }`}
              >
                {weekNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Overview Card for Week */}
      <div className="bg-gradient-to-r from-rosewater-50 to-warm-50 rounded-3xl p-6 sm:p-8 border border-rosewater-100/70 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rosewater-200/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rosewater-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-rosewater-600/20">
              {selectedWeek}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                Week {selectedWeek} of Pregnancy
              </h2>
              <p className="text-xs text-rosewater-800 font-semibold mt-0.5">
                Baby is approximately {currentData.size}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-white/80 py-2 px-4 rounded-xl border border-rosewater-100">
            <div>
              <span className="text-[10px] text-slate-400 block font-normal uppercase">Length</span>
              <span>{currentData.length}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 block font-normal uppercase">Weight</span>
              <span>{currentData.weight}</span>
            </div>
          </div>
        </div>

        {/* Baby & Mother Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-rosewater-700 font-bold text-xs">
              <Baby className="w-4 h-4" />
              <span>Baby's Development This Week</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{currentData.babyDev}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-sage-700 font-bold text-xs">
              <Heart className="w-4 h-4" />
              <span>Mother's Physiological Changes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{currentData.momChanges}</p>
          </div>
        </div>
      </div>

      {/* Helpful Care Topics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-5">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          Weekly Wellness Focus
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/70 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Apple className="w-4 h-4" />
              <span>Nutrition Focus</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{currentData.nutrition}</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
              <Moon className="w-4 h-4" />
              <span>Sleep & Rest</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{currentData.sleep}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Activity className="w-4 h-4" />
              <span>Movement & Exercise</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{currentData.exercise}</p>
          </div>
        </div>

        {/* Doctor Discussion Question */}
        <div className="p-4 rounded-2xl bg-lavender-50/60 border border-lavender-100 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-lavender-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">Question for Your Healthcare Provider:</h4>
            <p className="text-xs text-slate-600 mt-0.5 font-medium italic">
              "{currentData.doctorQuestion}"
            </p>
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default WeeklyInfo;
