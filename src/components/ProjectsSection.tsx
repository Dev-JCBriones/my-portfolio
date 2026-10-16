import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { allProjects } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface ProjectsSectionProps {
  onOpenProject: (projectId: string) => void;
  onViewAllWork: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onOpenProject,
  onViewAllWork,
}) => {
  const { playSound } = useTheme();
  const [filter, setFilter] = useState<'all' | 'backend' | 'infra'>('all');

  const categories = [
    { label: 'All Featured', value: 'all' as const },
    { label: 'Backend & APIs', value: 'backend' as const },
    { label: 'Developer & Infra Tools', value: 'infra' as const },
  ];

  const filteredProjects = filter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.categoryType === filter);

  return (
    <section id="projects-section" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header with Title, filter, and "View All Work" */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
            Selected Work
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]"
          >
            Featured Projects
          </motion.h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  playSound('click');
                  setFilter(cat.value);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === cat.value
                    ? 'bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] font-semibold shadow-sm'
                    : 'text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-[#FAF7F3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => {
              playSound('click');
              onViewAllWork();
            }}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#111111] dark:text-[#FAF7F3] hover:underline underline-offset-4 transition-colors cursor-pointer px-2"
          >
            <span>View All ({allProjects.length})</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {filteredProjects.map((project, index) => {
          const isLarge = index === 0;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                playSound('pop');
                onOpenProject(project.id);
              }}
              className={`group relative cursor-pointer overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#141414] shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 flex flex-col justify-between ${
                isLarge ? 'md:col-span-12' : 'md:col-span-6'
              }`}
            >
              {/* Cover Image Container */}
              <div
                className={`relative w-full overflow-hidden bg-[#181818] ${
                  isLarge ? 'aspect-[16/10] sm:aspect-[21/9]' : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                {/* Top Badges: Category & Year */}
                <div className="absolute top-4 sm:top-5 inset-x-4 sm:inset-x-5 flex items-center justify-between pointer-events-none gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-[#FAF7F3] border border-white/10 shadow-sm">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-[#FAF7F3]/90 border border-white/10 shadow-sm">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Project Card Details Body (in natural document flow, zero overlap) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 bg-[#141414] border-t border-white/5 gap-5">
                {/* Title & Subtitle */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#FAF7F3]/60">
                      {project.subtitle}
                    </span>
                    {project.impact && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        ROI: {project.impact.roi[0].value}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAF7F3] tracking-tight group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Key Architectural & Performance Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {project.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-[11px] sm:text-xs font-mono text-[#FAF7F3]/80 border border-white/10 shadow-sm flex items-center gap-1.5"
                      >
                        <span className="text-white/50">{m.label}:</span>
                        <strong className="text-white font-semibold">{m.value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Tags & Interactive CTA Arrow */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-white/75 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-medium text-white/50 group-hover:text-white/90 transition-colors hidden sm:inline">
                      View System
                    </span>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF7F3] text-[#111111] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-lg shrink-0">
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
