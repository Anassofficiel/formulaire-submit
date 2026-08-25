import React from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  return (
    <header className="w-full pt-6 pb-2 text-center">
      <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
        {/* Clean Circular Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mb-4 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md shadow-slate-200/60 bg-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={onOpenAdmin}
          title="Electro Mostafa"
        >
          <img
            src="https://i.postimg.cc/KvS7kMNd/Whats-App-Image-2026-08-24-at-17-11-29.jpg"
            alt="Electro Mostafa"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Title & Trust Message */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 tracking-tight">
            طلب جهازك المنزلي بسهولة
          </h1>
          <p className="text-slate-500 text-sm font-normal">
            عمر معلوماتك وسنتواصل معك لتأكيد الطلب
          </p>
        </motion.div>
      </div>
    </header>
  );
};

