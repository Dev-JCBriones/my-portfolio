import React from 'react';
import { motion } from 'motion/react';
import { Clock, Layers, ShieldCheck, Zap, Globe, ArrowUpRight, CheckCircle2, Calendar } from 'lucide-react';
import { deliveryStandardsData, bioData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const DeliveryStandardsSection: React.FC = () => {
  const { playSound, setBookingOpen } = useTheme();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const globalPillars = [
    {
      icon: '🌐',
      title: 'Worldwide Timezones',
      detail: '100% adaptable to any client working hours globally',
    },
    {
      icon: '🇶🇦',
      title: 'Qatar & Onsite Abroad',
      detail: 'Ready for onsite roles & work visa sponsorship',
    },
    {
      icon: '✈️',
      title: 'Global Relocation',
      detail: 'Open to relocate internationally to any country',
    },
    {
      icon: '💼',
      title: 'Distributed Remote',
      detail: 'Equipped for full-time contracts & async pipelines',
    },
  ];

  return (
    <section id="how-i-work" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
            Global Engineering & Collaboration Standards
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]"
          >
            How I Work With Global Teams
          </motion.h2>
        </div>

        <p className="text-sm sm:text-base text-[#111111]/70 dark:text-[#FAF7F3]/70 max-w-md">
          Structured for high-performing international teams. Combining asynchronous clarity, zero-regression test rigor, and completely flexible timezone overlap.
        </p>
      </div>

      {/* Global Timezone & Relocation Readiness Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 p-5 sm:p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#111111]/10 dark:border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] flex items-center justify-center shadow-sm shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#111111] dark:text-[#FAF7F3]">
                Global Working Hours Flexibility & Onsite Relocation
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold whitespace-nowrap shrink-0">
                Available Worldwide
              </span>
            </div>
            <p className="text-xs text-[#111111]/60 dark:text-[#FAF7F3]/60 mt-0.5">
              Open to any country worldwide. Flexible schedule tailored to client hours, full-time remote contracts, and onsite roles in Qatar and globally.
            </p>
          </div>
        </div>

        {/* Global Flexibility Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          {globalPillars.map((item) => (
            <div
              key={item.title}
              className="px-3 py-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#111111] dark:text-[#FAF7F3]">
                <span>{item.icon}</span>
                <span className="truncate">{item.title}</span>
              </div>
              <span className="text-[10px] font-mono text-[#111111]/60 dark:text-[#FAF7F3]/60 block mt-1 leading-tight">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {deliveryStandardsData.map((std, idx) => (
          <motion.div
            key={std.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-[24px] sm:rounded-[28px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] p-6 sm:p-8 border border-[#111111]/10 dark:border-white/10 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] flex items-center justify-center shadow-md">
                  {getIcon(std.icon)}
                </div>
                <span className="text-xs font-mono font-bold text-[#111111]/40 dark:text-[#FAF7F3]/40 tracking-wider">
                  {std.number}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F3] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                {std.title}
              </h3>

              <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {std.tagline}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-[#111111]/70 dark:text-[#FAF7F3]/70 leading-relaxed">
                {std.description}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#111111]/10 dark:border-white/10 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#111111]/50 dark:text-[#FAF7F3]/50 block mb-2">
                Engineering Deliverables & Protocols
              </span>
              {std.deliverables.map((deliv, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#111111]/80 dark:text-[#FAF7F3]/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{deliv}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA Banner for International Recruiters & Clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 p-7 sm:p-9 rounded-[24px] sm:rounded-[32px] bg-[#141414] text-[#FAF7F3] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl"
      >
        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
            Direct International Engagement
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Interested in adding a senior backend engineer to your team?
          </h4>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl">
            Available for full-time remote positions, abroad relocation contracts, and high-impact API architecture sprints.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('pop');
            setBookingOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#111111] font-semibold text-xs sm:text-sm tracking-wide uppercase hover:bg-[#FAF7F3] transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shrink-0 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Book a 15-Min Intro Call</span>
        </button>
      </motion.div>
    </section>
  );
};
