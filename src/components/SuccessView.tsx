import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { LeadFormData } from '../types';

interface SuccessViewProps {
  leadId: string;
  formData: LeadFormData;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ leadId, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100 relative overflow-hidden text-center"
    >
      {/* Top Accent Strip */}
      <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-emerald-400 to-teal-400 rounded-t-3xl" />

      {/* Animated Success Check Icon */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner border border-emerald-100"
        >
          <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
        </motion.div>
      </div>

      {/* Primary Confirmation Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-3"
      >
        شكراً لك، تم تسجيل طلبك بنجاح
      </motion.h2>

      {/* Subheading Note */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-base sm:text-lg text-slate-600 font-medium max-w-md mx-auto leading-relaxed mb-6"
      >
        سنتواصل معك قريباً لتأكيد الطلب
      </motion.p>

      {/* Order Reference Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-bold text-slate-600 mb-8"
      >
        <span className="text-slate-400 font-sans font-normal">رقم الطلب:</span>
        <span className="text-blue-700 dir-ltr">#{leadId}</span>
      </motion.div>

      {/* Button to Submit Another Order */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <ArrowRight className="w-4 h-4" />
          <span>تقديم طلب جديد</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
