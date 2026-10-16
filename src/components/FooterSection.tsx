import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowUp, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { bioData } from '../data/portfolioData';

interface FooterSectionProps {
  onNavigate: (view: 'home' | 'work' | 'project', id?: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  const { playSound, setResumeOpen, setSearchOpen } = useTheme();

  const quicklinks = [
    { label: 'Home', view: 'home' as const, id: 'hero-section' },
    { label: 'About Me', view: 'home' as const, id: 'bio-section' },
    { label: 'API Sandbox', view: 'home' as const, id: 'api-sandbox' },
    { label: 'Technical Stack', view: 'home' as const, id: 'tech-stack' },
    { label: 'Experience Timeline', view: 'home' as const, id: 'experience-section' },
    { label: 'Services', view: 'home' as const, id: 'services' },
    { label: 'Works', view: 'work' as const, id: 'work-section' },
    { label: 'Contact', view: 'home' as const, id: 'contact' },
  ];

  const scrollToTop = () => {
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#111111] dark:bg-[#0A0A0A] text-[#FAF7F3] pt-20 pb-12 px-4 sm:px-6 mt-20 border-t border-white/10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col justify-between">
        {/* Top Row: Tagline + Quicklinks + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Big Editorial Slogan */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF7F3] max-w-sm">
              Scaling Start-ups for Growth.
            </h2>
            <p className="text-sm text-[#FAF7F3]/60 max-w-sm leading-relaxed">
              Backend-first engineering with clean software craftsmanship, structural data integrity, and high-performance APIs.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  playSound('pop');
                  setResumeOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                View Full CV
              </button>
              <button
                onClick={() => {
                  playSound('pop');
                  setSearchOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 transition-colors cursor-pointer"
              >
                ⌘K Command Palette
              </button>
            </div>
          </div>

          {/* Quicklinks */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono text-[#FAF7F3]/40 tracking-wider uppercase block mb-3">
              / Quicklinks
            </span>
            <ul className="space-y-2">
              {quicklinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      playSound('click');
                      onNavigate(link.view, link.id);
                    }}
                    className="text-xs sm:text-sm text-[#FAF7F3]/80 hover:text-[#FAF7F3] transition-colors cursor-pointer inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono text-[#FAF7F3]/40 tracking-wider uppercase block mb-3">
              / Contact & Base
            </span>
            <div>
              <a
                href={`mailto:${bioData.email}`}
                className="text-sm sm:text-base font-medium text-[#FAF7F3] hover:underline underline-offset-4 flex items-center gap-1.5 group"
              >
                <span>{bioData.email}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <p className="text-xs text-[#FAF7F3]/50 pt-1 leading-relaxed">
              Based in Bulacan, Philippines. Available for remote engineering contracts, system architecture consulting, and full-time senior backend roles.
            </p>

            <div className="pt-3">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Giant JC Typography Brand Element */}
        <div className="pt-10 flex items-center justify-between select-none">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <span className="text-[clamp(4.5rem,18vw,14rem)] font-extrabold tracking-[-0.05em] text-[#FAF7F3]/15 leading-none">
              JC
            </span>
            <div className="text-left sm:text-right text-xs text-[#FAF7F3]/40 space-y-1">
              <p>© 2026 John Carlo Briones (Dev JC).</p>
              <p>Engineered with React 19, Tailwind CSS & Framer Motion.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
