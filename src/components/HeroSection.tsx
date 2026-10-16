import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Globe, Calendar, ArrowUpRight, Code2, Server, Database, ChevronDown, Copy, Check, Mail } from 'lucide-react';
import { bioData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const HeroSection: React.FC = () => {
  const { setBookingOpen, playSound, showToast } = useTheme();

  // Live Philippine Time (UTC+8)
  const [phTime, setPhTime] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    playSound('pop');
    navigator.clipboard.writeText(bioData.email);
    setCopiedEmail(true);
    showToast(`Email copied: ${bioData.email}`, 'copy');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setPhTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSkills = () => {
    playSound('click');
    const el = document.getElementById('tech-stack');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] flex flex-col justify-between items-center px-4 sm:px-6 pt-28 sm:pt-32 pb-12 overflow-hidden select-none"
    >
      {/* Background Architectural Subtle Ambient Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[800px] h-[500px] rounded-full bg-black/[0.025] dark:bg-white/[0.03] blur-[120px]" />
      </div>

      {/* Top Status Strip */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6"
      >
        {/* Location & Live Clock */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-[#111111]/80 dark:text-[#FAF7F3]/80 border border-black/5 dark:border-white/10 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bulacan, PH</span>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1 font-semibold tabular-nums">
            <Clock className="w-3 h-3 opacity-60" />
            <span>{phTime || 'UTC+8'}</span>
          </span>
        </div>

        {/* Global Remote & Relocation Readiness */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-300 border border-emerald-500/20">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open to Global Remote & Relocation</span>
        </div>

        {/* Quick Copy Email Pill */}
        <button
          onClick={handleCopyEmail}
          title="Click to copy email address"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-mono text-[#FAF7F3]/90 hover:text-white border border-white/10 shadow-xs transition-all cursor-pointer active:scale-95 group"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400/90 group-hover:text-amber-300" />
          <span>{bioData.email}</span>
          {copiedEmail ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </motion.div>

      {/* Main Hero Typography & Engineering Focus */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center my-auto">
        <div className="flex flex-col items-center justify-center leading-none tracking-tighter w-full">
          <motion.div
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden w-full"
          >
            <h1 className="text-[clamp(2.75rem,11.5vw,9.5rem)] font-extrabold text-[#111111] dark:text-[#FAF7F3] uppercase tracking-[-0.04em] leading-[0.88] select-none text-balance">
              SOFTWARE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mt-1 sm:mt-2 w-full"
          >
            <h1 className="text-[clamp(2.75rem,11.5vw,9.5rem)] font-extrabold text-[#111111] dark:text-[#FAF7F3] uppercase tracking-[-0.04em] leading-[0.88] select-none text-balance">
              ENGINEER
            </h1>
          </motion.div>
        </div>

        {/* Crisp Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#111111]/75 dark:text-[#FAF7F3]/75 max-w-2xl font-normal leading-relaxed text-balance"
        >
          Architecting high-performance backend systems with <strong className="font-semibold text-[#111111] dark:text-white">PHP (Laravel)</strong>, optimizing relational <strong className="font-semibold text-[#111111] dark:text-white">PostgreSQL & MySQL</strong> databases, and authoring rigorous <strong className="font-semibold text-[#111111] dark:text-white">automated test suites</strong> for global teams.
        </motion.p>

        {/* Clean Engineering Competencies Tags (Zero-Pill Minimalist Unboxed Style) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-mono text-[#111111]/60 dark:text-[#FAF7F3]/60"
        >
          <span className="flex items-center gap-1.5 font-medium text-[#111111]/80 dark:text-[#FAF7F3]/80">
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Laravel 11 & PHP 8.x</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1.5 font-medium text-[#111111]/80 dark:text-[#FAF7F3]/80">
            <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>PostgreSQL & MySQL Tuning</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1.5 font-medium text-[#111111]/80 dark:text-[#FAF7F3]/80">
            <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Bruno Automated API Tests</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="font-medium text-[#111111]/80 dark:text-[#FAF7F3]/80">
            Distributed Redis Queues
          </span>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5"
        >
          {/* Primary CTA: Book Call */}
          <button
            onClick={() => {
              playSound('pop');
              setBookingOpen(true);
            }}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] font-semibold text-xs sm:text-sm tracking-wide uppercase hover:bg-black dark:hover:bg-white transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Book a 15-Min Intro Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Secondary CTA: Inspect Skills */}
          <button
            onClick={scrollToSkills}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#111111] dark:text-[#FAF7F3] font-semibold text-xs sm:text-sm tracking-wide uppercase border border-black/5 dark:border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Skills & Stack</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
        </motion.div>
      </div>

      {/* Quantitative Bottom Proof Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full max-w-4xl mx-auto mt-10 pt-6 border-t border-black/5 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
      >
        {bioData.stats.map((st) => (
          <div key={st.label} className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#111111] dark:text-[#FAF7F3] tabular-nums">
              {st.value}
            </span>
            <p className="text-[11px] sm:text-xs text-[#111111]/60 dark:text-[#FAF7F3]/60 leading-tight">
              {st.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
