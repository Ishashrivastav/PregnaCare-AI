import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client.js';
import { Doctor } from '../types/index.js';
import { CardSkeleton } from '../components/common/LoadingSpinner.js';
import EmptyState from '../components/common/EmptyState.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

export const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('ALL');
  const [location, setLocation] = useState('ALL');

  const specialties = [
    'ALL',
    'Obstetrician / Gynecologist',
    'Maternal-Fetal Medicine Specialist',
    'Prenatal Nutritionist',
    'Lactation Consultant',
    'Perinatal Mental Health Specialist',
  ];

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDoctors({
        search: search.trim() || undefined,
        specialty: specialty !== 'ALL' ? specialty : undefined,
        location: location !== 'ALL' ? location : undefined,
      });
      setDoctors(data || []);
    } catch (err: any) {
      console.error('Failed to load doctors', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Healthcare Specialist Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover qualified maternal health professionals and schedule simulated consultations
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>Fictional Demonstration Profiles</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-slate-100 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors by name, hospital, or keywords..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Specialty:
          </span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialty(spec)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition ${
                specialty === spec
                  ? 'bg-rosewater-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {spec === 'ALL' ? 'All Specialties' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors found"
          description="Try adjusting your search criteria or clear the specialty filter."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setSpecialty('ALL');
            setLocation('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between hover:shadow-soft-lg transition group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-rosewater-50 border border-slate-100 shadow-sm shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-rosewater-600 transition">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-rosewater-700 mt-0.5">
                      {doc.specialty}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.experience} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 py-3 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.hospitalClinic} • {doc.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.availability}</span>
                  </div>
                </div>

                {doc.about && (
                  <p className="text-[11px] text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {doc.about}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3">
                <Link
                  to={`/doctors/${doc.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-rosewater-50 text-slate-700 hover:text-rosewater-700 text-xs font-bold transition flex items-center justify-center gap-1.5 group-hover:border-rosewater-200"
                >
                  <span>View Doctor Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};

export default Doctors;
