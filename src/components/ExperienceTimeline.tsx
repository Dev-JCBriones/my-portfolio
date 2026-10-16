import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { experienceTimeline } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const ExperienceTimeline: React.FC = () => {
  const { playSound } = useTheme();
  const [expandedId, setExpandedId] = useState<string>(experienceTimeline[0].id);

  const toggle = (id: string) => {
    playSound('click');
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="experience-section" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-14 max-w-2xl">
        <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
          Career Journey & Track Record
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]">
          Engineering Experience
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#111111]/70 dark:text-[#FAF7F3]/70 leading-relaxed">
          From hardware network topologies and operational data precision to modern, resilient server-side architectures.
        </p>
      </div>

      {/* Timeline items */}
      <div className="relative border-l-2 border-[#111111]/15 dark:border-white/15 ml-3 sm:ml-6 space-y-10">
        {experienceTimeline.map((item, index) => {
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-6 sm:pl-10"
            >
              {/* Dot Anchor */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                  isExpanded
                    ? 'bg-[#111111] dark:bg-[#FAF7F3] border-[#111111] dark:border-[#FAF7F3]'
                    : 'bg-[#FAF7F3] dark:bg-[#111111] border-[#111111]/40 dark:border-white/40'
                }`}
              />

              {/* Card Container */}
              <div
                onClick={() => toggle(item.id)}
                className="group cursor-pointer rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] p-6 sm:p-7 border border-[#111111]/10 dark:border-white/10 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FAF7F3] tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                      {item.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#111111]/70 dark:text-[#FAF7F3]/70 font-medium mt-1">
                      <span className="font-semibold text-[#111111] dark:text-[#FAF7F3]">
                        {item.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[#111111]/80 dark:text-[#FAF7F3]/80">
                      {item.period}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#111111]/50 dark:text-white/50 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Short description */}
                <p className="mt-3 text-sm sm:text-base text-[#111111]/80 dark:text-[#FAF7F3]/80 leading-relaxed">
                  {item.description}
                </p>

                {/* Expandable Achievements & Tech tags */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pt-4 mt-4 border-t border-[#111111]/10 dark:border-white/10 space-y-4"
                    >
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#111111]/50 dark:text-[#FAF7F3]/50 block mb-2">
                          Key Responsibilities & Impact
                        </span>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#111111]/80 dark:text-[#FAF7F3]/80">
                          {item.achievements.map((ach, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-[#FAF7F3] mt-2 shrink-0" />
                              <span className="leading-relaxed">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech badges */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#111111]/5 dark:bg-white/10 text-[#111111] dark:text-[#FAF7F3]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
