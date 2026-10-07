import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClass} rounded-full border-rosewater-200 border-t-rosewater-600 animate-spin`}
      />
      {message && <p className="text-xs font-medium text-slate-500 tracking-wide">{message}</p>}
    </div>
  );
};

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 animate-pulse space-y-4">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-100 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
