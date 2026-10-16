import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Mail, Search, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MobileBottomBar: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const { setBookingOpen, setSearchOpen, playSound, bookingOpen, resumeOpen, searchOpen } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide if any modal is active
  if (bookingOpen || resumeOpen || searchOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 inset-x-3 z-40 sm:hidden flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[#121214]/90 backdrop-blur-lg border border-white/10 shadow-2xl"
        >
          {/* Quick 15-min Call */}
          <button
            onClick={() => {
              playSound('click');
              setBookingOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F3] text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Book Call</span>
          </button>

          {/* Quick Contact Form */}
          <button
            onClick={() => {
              playSound('click');
              onContactClick();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF7F3] text-[#111111] text-xs font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              playSound('pop');
              setSearchOpen(true);
            }}
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/80 transition-all active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Top scroll trigger */}
          <button
            onClick={() => {
              playSound('pop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Scroll to top"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/80 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
