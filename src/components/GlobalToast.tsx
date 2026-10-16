import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const GlobalToast: React.FC = () => {
  const { toast } = useTheme();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#16171B]/95 text-[#FAF7F3] border border-white/15 shadow-2xl backdrop-blur-md font-sans text-xs sm:text-sm font-medium">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              {toast.type === 'copy' ? (
                <Copy className="w-3 h-3" />
              ) : toast.type === 'info' ? (
                <Info className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
            <span>{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
