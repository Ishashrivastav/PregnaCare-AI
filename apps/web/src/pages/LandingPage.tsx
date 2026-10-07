import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  CalendarCheck2,
  FolderKanban,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Baby,
} from 'lucide-react';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const LandingPage: React.FC = () => {
  const highlights = [
    {
      icon: Sparkles,
      title: 'Safety-First AI Companion',
      description: 'Educational symptom insights, doctor consultation preparation, and automatic urgent triage.',
    },
    {
      icon: FolderKanban,
      title: 'Pregnancy Project Management',
      description: 'Structured plans for hospital selection, nursery preparation, and trimester care routines.',
    },
    {
      icon: CalendarCheck2,
      title: 'Milestones & Timeline',
      description: 'Interactive weekly guidance from Week 1 to Week 40+ with developmental changes and tips.',
    },
    {
      icon: Stethoscope,
      title: 'Doctor Discovery & Visits',
      description: 'Browse verified maternal specialties and schedule simulated prenatal appointments.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbf9] via-[#faf8f5] to-[#f4f7f5] text-slate-800">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rosewater-500 to-rosewater-600 flex items-center justify-center text-white shadow-md shadow-rosewater-500/20">
            <Heart className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            PregnaCare <span className="text-rosewater-600">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-rosewater-700 transition px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rosewater-600/20 transition active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rosewater-100/70 text-rosewater-800 text-xs font-bold mb-6 tracking-wide shadow-sm">
          <Baby className="w-4 h-4 text-rosewater-600" />
          <span>Your Intelligent Pregnancy Care Companion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Compassionate Guidance for Every Step of Your{' '}
          <span className="bg-gradient-to-r from-rosewater-600 to-rose-500 bg-clip-text text-transparent">
            Pregnancy Journey
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          PregnaCare AI combines clinical-grade educational timelines, structured project planning, doctor visit preparation, and a safety-first AI assistant to empower expecting mothers.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-sm font-bold shadow-lg shadow-rosewater-600/25 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Start Your Care Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 shadow-sm transition"
          >
            Explore Demo Account
          </Link>
        </div>

        {/* Hero Preview Card */}
        <div className="mt-14 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-rosewater-100/80 text-left max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center font-bold">
                24
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800">Week 24 • Second Trimester</h2>
                <p className="text-[11px] text-slate-400">Baby is approximately the size of an ear of corn</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              On Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-rosewater-50/50 border border-rosewater-100">
              <p className="text-[10px] font-bold text-rosewater-700 uppercase">Hospital Prep</p>
              <p className="text-xs font-bold text-slate-800 mt-1">65% Completed</p>
              <div className="w-full bg-rosewater-200/50 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-rosewater-600 h-full w-[65%]" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/50 border border-sage-100">
              <p className="text-[10px] font-bold text-sage-700 uppercase">Next Appointment</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Dr. Evelyn Vance, MD</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Routine Prenatal Checkup</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-lavender-50/50 border border-lavender-100">
              <p className="text-[10px] font-bold text-lavender-700 uppercase">PregnaCare AI</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Safety Checked</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Non-diagnostic educational answers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200/60">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Peace of Mind
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Every feature is built to keep expecting mothers organized, informed, and safely connected to qualified healthcare providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 hover:shadow-soft-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-rosewater-50 text-rosewater-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{h.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{h.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Notice Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 text-center">
        <MedicalDisclaimer className="mb-6 text-left" />
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} PregnaCare AI. Educational and organizational companion. Not a substitute for professional healthcare.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
