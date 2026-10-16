import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allProjects } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface WorksViewProps {
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
}

export const WorksView: React.FC<WorksViewProps> = ({ onBack, onSelectProject }) => {
  const { playSound } = useTheme();
  const [filter, setFilter] = useState<'all' | 'backend' | 'infra'>('all');

  const categories = [
    { label: 'All Projects', value: 'all' as const },
    { label: 'Backend Architecture', value: 'backend' as const },
    { label: 'DevOps & Tooling', value: 'infra' as const },
  ];

  const filtered = filter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.categoryType === filter);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => {
          playSound('click');
          onBack();
        }}
        className="group inline-flex items-center gap-2 text-sm font-semibold text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-[#FAF7F3] mb-10 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </motion.button>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 max-w-2xl"
      >
        <span className="text-xs font-mono tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-3">
          Projects — Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAF7F3] leading-tight">
          My Brightest Creations
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#111111]/75 dark:text-[#FAF7F3]/75 leading-relaxed">
          A showcase of backend systems, developer tooling, and full-stack web applications engineered for scale and speed.
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
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
                  : 'bg-black/5 dark:bg-white/5 text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {filtered.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              playSound('pop');
              onSelectProject(project.id);
            }}
            className="group cursor-pointer rounded-[24px] bg-[#141414] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 flex flex-col justify-between"
          >
            {/* Image Frame */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#181818]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

              {/* Category & Year Tags */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-[#FAF7F3] border border-white/10 shadow-sm">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-[#FAF7F3]/90 border border-white/10 shadow-sm">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#141414] border-t border-white/5 gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-[#FAF7F3]/60 block mb-1">
                  {project.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-[#FAF7F3] tracking-tight group-hover:text-white transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {project.metrics.map((m) => (
                    <span
                      key={m.label}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-[#FAF7F3]/80 border border-white/10 shadow-sm flex items-center gap-1.5"
                    >
                      <span className="text-white/50">{m.label}:</span>
                      <strong className="text-white font-semibold">{m.value}</strong>
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Tags & Arrow */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-t border-white/5">
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

                <div className="w-10 h-10 rounded-full bg-[#FAF7F3] text-[#111111] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-md shrink-0 self-end sm:self-auto">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
