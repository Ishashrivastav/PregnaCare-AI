import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  className?: string;
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<Props> = ({ className = '', compact = false }) => {
  return (
    <div
      className={`rounded-xl border border-rosewater-200/60 bg-rosewater-50/50 p-3.5 text-xs text-rosewater-900/90 shadow-sm flex items-start gap-2.5 ${className}`}
    >
      <AlertCircle className="w-4 h-4 text-rosewater-700 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-rosewater-800">Clinical Disclaimer: </span>
        <span>
          PregnaCare AI provides general educational and organizational support. It does not replace professional medical advice, diagnosis, or treatment. In case of emergency or severe symptoms, please contact your doctor or local emergency services immediately.
        </span>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
