import React, { useState } from 'react';
import {
  HelpCircle,
  Send,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Copy,
  Sparkles,
} from 'lucide-react';
import api from '../api/client.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const AskDoctor: React.FC = () => {
  const [concern, setConcern] = useState('');
  const [currentWeek, setCurrentWeek] = useState<number>(24);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    suggestedQuestions: string[];
    specialtyRecommendation: string;
    warningSignsToWatch: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleConcerns = [
    'I have been experiencing lower back and pelvic discomfort after walking.',
    'I am noticing mild swelling in my ankles toward the late afternoon.',
    'I feel anxious about birth labor pain and would like to understand coping options.',
    'I am getting frequent heartburn after eating small dinners.',
  ];

  const handleGenerate = async (textToUse?: string) => {
    const text = textToUse || concern;
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setCopied(false);
    try {
      const data = await api.askDoctor({
        concern: text,
        currentWeek,
      });
      setResult(data);
    } catch (err: any) {
      console.error('Error generating doctor prep questions', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `PregnaCare Visit Preparation:\nConcern: ${concern}\n\nQuestions for Doctor:\n${result.suggestedQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n')}\n\nWarning Signs:\n${result.warningSignsToWatch
      .map((w) => `• ${w}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Ask Your Doctor Prep
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn your symptoms and concerns into high-value questions for your next prenatal visit
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center shadow-sm">
          <Stethoscope className="w-5 h-5" />
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            What symptom or topic would you like to discuss?
          </label>
          <textarea
            rows={3}
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="e.g. I have been having pelvic pressure and mild headaches in the afternoon..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
          />
        </div>

        {/* Quick Sample Concern Pills */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Try a common example:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleConcerns.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setConcern(s);
                  handleGenerate(s);
                }}
                className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-rosewater-50 hover:text-rosewater-700 px-3 py-1.5 rounded-xl border border-slate-100 transition text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Stage:</span>
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="text-xs font-bold bg-slate-100 border-none rounded-xl px-2.5 py-1.5 text-slate-700 focus:ring-2 focus:ring-rosewater-400"
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !concern.trim()}
            className="px-6 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Generating questions...' : 'Generate Questions'}</span>
          </button>
        </div>
      </div>

      {/* Generated Results Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-sage-600 uppercase tracking-wider">
                Consultation Blueprint
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-0.5">
                Questions for Your Next Prenatal Visit
              </h2>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Checklist'}</span>
            </button>
          </div>

          {/* Specialty Recommendation */}
          <div className="p-3.5 rounded-2xl bg-sage-50/70 border border-sage-100 flex items-center gap-2.5 text-xs text-sage-900 font-semibold">
            <Stethoscope className="w-4 h-4 text-sage-600 shrink-0" />
            <span>Recommended Specialist: {result.specialtyRecommendation}</span>
          </div>

          {/* Suggested Questions */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Discussion Questions:
            </h3>
            {result.suggestedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-rosewater-100 text-rosewater-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">{q}</p>
              </div>
            ))}
          </div>

          {/* Warning signs to watch */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Red-Flag Warning Signs (Require Prompt Clinical Attention):</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1 pl-6 list-disc">
              {result.warningSignsToWatch.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};

export default AskDoctor;
