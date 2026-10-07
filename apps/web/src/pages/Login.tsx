import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import MedicalDisclaimer from '../components/common/MedicalDisclaimer.js';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const [error, setError] = useState<string | null>(
    isExpired ? 'Your session has expired. Please log in again.' : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = (email: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fff8f6] via-[#faf8f5] to-[#f4f8f6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rosewater-500 to-rosewater-600 flex items-center justify-center text-white shadow-md shadow-rosewater-500/20">
            <Heart className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            PregnaCare <span className="text-rosewater-600">AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to access your pregnancy care plan and dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-lg rounded-3xl border border-rosewater-100/70">
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 focus:border-transparent transition"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosewater-400 focus:border-transparent transition"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-rosewater-600 hover:bg-rosewater-700 text-white text-xs font-bold shadow-md shadow-rosewater-600/20 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Credentials Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoUser('demo@pregnacare.com')}
                className="py-1.5 px-2 rounded-lg bg-rosewater-50 hover:bg-rosewater-100 text-[10px] font-bold text-rosewater-700 transition"
              >
                Sarah (W24)
              </button>
              <button
                type="button"
                onClick={() => fillDemoUser('emily@pregnacare.com')}
                className="py-1.5 px-2 rounded-lg bg-sage-50 hover:bg-sage-100 text-[10px] font-bold text-sage-700 transition"
              >
                Emily (W10)
              </button>
              <button
                type="button"
                onClick={() => fillDemoUser('olivia@pregnacare.com')}
                className="py-1.5 px-2 rounded-lg bg-lavender-50 hover:bg-lavender-100 text-[10px] font-bold text-lavender-700 transition"
              >
                Olivia (W34)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-rosewater-700 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <MedicalDisclaimer className="mt-6" />
      </div>
    </div>
  );
};

export default Login;
