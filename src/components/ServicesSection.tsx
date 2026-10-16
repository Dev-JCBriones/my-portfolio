import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import { servicesData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const ServicesSection: React.FC = () => {
  const { playSound } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(servicesData[0].id);

  const toggleExpand = (id: string) => {
    playSound('click');
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="relative pt-10 sm:pt-14 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
          Capabilities & Deliverables
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]"
        >
          Services
        </motion.h2>
      </div>

      {/* Services List / Cards */}
      <div className="border-t border-[#111111]/15 dark:border-white/15 divide-y divide-[#111111]/15 dark:divide-white/15">
        {servicesData.map((service, index) => {
          const isExpanded = expandedId === service.id;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group py-7 sm:py-8 transition-colors duration-200"
            >
              <div
                onClick={() => toggleExpand(service.id)}
                className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Title & Index */}
                <div className="flex items-start md:items-center gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-mono text-[#111111]/40 dark:text-[#FAF7F3]/40 font-semibold tracking-wider pt-1 md:pt-0">
                    {service.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#111111] dark:text-[#FAF7F3] group-hover:text-black dark:group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* Tags & Expand icon */}
                <div className="flex items-center justify-between md:justify-end gap-6 pl-8 md:pl-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#111111]/60 dark:text-[#FAF7F3]/60 font-medium">
                    {service.tags.map((tag, tagIdx) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {tagIdx < service.tags.length - 1 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/30 dark:bg-white/30 mx-1" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    aria-label={`Toggle details for ${service.title}`}
                    className="w-8 h-8 rounded-full border border-[#111111]/20 dark:border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#111111] dark:group-hover:bg-white group-hover:text-[#FAF7F3] dark:group-hover:text-[#111111] group-hover:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    {isExpanded ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Description & Architectural Highlights */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden pl-8 sm:pl-12"
                  >
                    <p className="pt-4 text-[#111111]/80 dark:text-[#FAF7F3]/80 max-w-3xl text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>

                    {service.highlights && (
                      <div className="mt-4 pt-3 border-t border-[#111111]/5 dark:border-white/5 space-y-2">
                        {service.highlights.map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#111111]/70 dark:text-[#FAF7F3]/70">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
