import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Mail, Calendar, Stethoscope, Edit, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const pregnancy = user?.pregnancyProfile;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          Account & Care Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your personal registration information and pregnancy timeline summary
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-5">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rosewater-500 to-rosewater-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-rosewater-500/20">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">{user?.fullName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified Account</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
            <p className="font-semibold text-slate-800 mt-0.5">{user?.email}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Member Since</span>
            <p className="font-semibold text-slate-800 mt-0.5">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </p>
          </div>
        </div>
      </div>

      {/* Pregnancy Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rosewater-50 text-rosewater-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Pregnancy Journey Summary</h3>
              <p className="text-[11px] text-slate-400">Current gestation and care preferences</p>
            </div>
          </div>
          <Link
            to="/pregnancy-profile"
            className="px-3.5 py-1.5 rounded-xl bg-rosewater-50 text-rosewater-700 hover:bg-rosewater-100 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {pregnancy ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3.5 rounded-2xl bg-rosewater-50/50 border border-rosewater-100/60">
              <span className="text-[10px] font-bold text-rosewater-700 uppercase">Current Stage</span>
              <p className="font-black text-slate-800 mt-1">Week {pregnancy.currentWeek}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sage-50/50 border border-sage-100/60">
              <span className="text-[10px] font-bold text-sage-700 uppercase">Estimated Due Date</span>
              <p className="font-black text-slate-800 mt-1">
                {new Date(pregnancy.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-lavender-50/50 border border-lavender-100/60">
              <span className="text-[10px] font-bold text-lavender-700 uppercase">Preferred Provider</span>
              <p className="font-black text-slate-800 mt-1 truncate">
                {pregnancy.preferredDoctor || 'Not assigned'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500">Pregnancy profile has not been configured yet.</p>
            <Link
              to="/pregnancy-profile"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-rosewater-600 text-white text-xs font-bold shadow-sm"
            >
              Set Up Pregnancy Profile
            </Link>
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default Profile;
