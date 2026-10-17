import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ScrollToTop: React.FC = () => {
  const { playSound, mobileMenuOpen, bookingOpen, resumeOpen, searchOpen } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
      setIsVisible(currentScroll > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playSound('pop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circular ring calculations (radius = 16, stroke = 2.5)
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Hide if menu or any modal is open
  if (mobileMenuOpen || bookingOpen || resumeOpen || searchOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center"
        >
          <button
            onClick={scrollToTop}
            title={`Scroll to top (${Math.round(scrollProgress)}%)`}
            aria-label="Scroll back to top"
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#141416]/90 hover:bg-[#1C1D21] text-[#FAF7F3] shadow-xl border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-95"
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 38 38">
              <circle
                cx="19"
                cy="19"
                r={radius}
                className="stroke-white/10"
                strokeWidth="2"
                fill="transparent"
              />
              <circle
                cx="19"
                cy="19"
                r={radius}
                className="stroke-white/80 group-hover:stroke-white transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Arrow Icon */}
            <ArrowUp className="w-4 h-4 text-white/70 group-hover:text-white group-hover:-translate-y-0.5 transition-all" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
