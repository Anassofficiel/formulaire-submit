import React from 'react';
import { ShieldCheck, Truck, Banknote } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center gap-6 sm:gap-8 pt-2 pb-1 text-slate-400 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="font-medium text-slate-500">دفع عند الاستلام</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
        <span className="font-medium text-slate-500">توصيل مجاني</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="font-medium text-slate-500">ضمان الجودة</span>
      </div>
    </div>
  );
};

