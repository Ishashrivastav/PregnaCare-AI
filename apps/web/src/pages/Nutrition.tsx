import React from 'react';
import { Apple, Droplets, ShieldAlert, CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Nutrition: React.FC = () => {
  const nutrients = [
    {
      name: 'Folate & Folic Acid',
      role: 'Supports neural tube development and cellular division.',
      sources: 'Dark leafy greens (spinach, kale), lentils, fortified cereals, oranges.',
    },
    {
      name: 'Iron',
      role: 'Essential for hemoglobin production and maternal blood volume expansion.',
      sources: 'Lean meats, beans, pumpkin seeds, dried apricots, spinach.',
    },
    {
      name: 'Calcium & Vitamin D',
      role: 'Builds fetal bones, teeth, nerves, and heart muscles.',
      sources: 'Pasteurized dairy, fortified plant milks, tofu, broccoli.',
    },
    {
      name: 'Choline & DHA',
      role: 'Crucial for fetal brain development and placental function.',
      sources: 'Eggs (cooked), low-mercury cooked fish (salmon), walnuts, chia seeds.',
    },
  ];

  const safetyFoods = {
    encourage: [
      'Well-washed fresh vegetables and fruits',
      'Cooked eggs with firm yolks and whites',
      'Pasteurized milk and dairy products',
      'Thoroughly cooked poultry and lean meats (internal 165°F / 74°C)',
      'Low-mercury cooked fish (wild salmon, sardines, tilapia)',
    ],
    avoid: [
      'Raw or undercooked meats, poultry, sushi, and seafood',
      'Unpasteurized dairy products or raw milk soft cheeses (e.g. unpasteurized brie/feta)',
      'Raw vegetable sprouts (alfalfa, clover, radish)',
      'High-mercury fish (swordfish, shark, king mackerel, bigeye tuna)',
      'Unpasteurized juices or raw refrigerated meat spreads (pâté)',
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Maternal Nutrition Education
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evidence-based nutritional principles, essential micronutrients, and dietary safety
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
          <Apple className="w-5 h-5" />
        </div>
      </div>

      {/* Hydration Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Hydration in Pregnancy</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Aim for approximately 8 to 10 glasses (2 to 2.5 liters) of water daily. Adequate hydration supports expanding blood volume, healthy amniotic fluid renewal, kidney clearance, and eases common constipation.
          </p>
        </div>
      </div>

      {/* Core Nutrients Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Vital Micronutrients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutrients.map((n, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow-soft border border-slate-100 space-y-2"
            >
              <div className="flex items-center gap-2 text-rosewater-700 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{n.name}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">{n.role}</p>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Common Sources:</span> {n.sources}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Eating Guidelines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-5">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Food Safety Reference Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Encourage */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Practices</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2">
              {safetyFoods.encourage.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Avoid */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Foods to Avoid or Limit</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2">
              {safetyFoods.avoid.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Medical Dietary Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          For personalized dietary restrictions, gestational diabetes meal planning, or specialized clinical conditions, please consult a registered prenatal dietitian or your obstetric provider.
        </span>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Nutrition;
