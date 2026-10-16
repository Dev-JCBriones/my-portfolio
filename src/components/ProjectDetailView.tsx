import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { allProjects } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  onContact: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onBack,
  onContact,
}) => {
  const { playSound, setBookingOpen } = useTheme();
  const project = allProjects.find((p) => p.id === projectId) || allProjects[0];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
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
        <span>Back to Projects</span>
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 block mb-2">
          Case Study & System Deep-Dive
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAF7F3] leading-tight">
          {project.title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl text-[#111111]/75 dark:text-[#FAF7F3]/75 font-medium">
          {project.subtitle}
        </p>
      </motion.div>

      {/* Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center gap-6 sm:gap-8 py-5 border-y border-[#111111]/15 dark:border-white/15 mb-10 text-sm"
      >
        <div>
          <span className="text-xs font-mono text-[#111111]/45 dark:text-[#FAF7F3]/45 uppercase block mb-0.5">
            Category
          </span>
          <span className="font-medium text-[#111111] dark:text-[#FAF7F3]">
            {project.category}
          </span>
        </div>

        <span className="text-[#111111]/20 dark:text-white/20">/</span>

        <div>
          <span className="text-xs font-mono text-[#111111]/45 dark:text-[#FAF7F3]/45 uppercase block mb-0.5">
            Timeline
          </span>
          <span className="font-medium text-[#111111] dark:text-[#FAF7F3]">
            {project.year}
          </span>
        </div>

        {project.liveUrl && (
          <>
            <span className="text-[#111111]/20 dark:text-white/20">/</span>
            <div>
              <span className="text-xs font-mono text-[#111111]/45 dark:text-[#FAF7F3]/45 uppercase block mb-0.5">
                Live Platform
              </span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#111111] dark:text-[#FAF7F3] hover:underline underline-offset-4 inline-flex items-center gap-1 group"
              >
                <span>Visit Site</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </>
        )}
      </motion.div>

      {/* Hero Showcase Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[24px] overflow-hidden shadow-2xl mb-14 bg-[#161616]"
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* Business Impact & ROI Section (Item 3) */}
      {project.impact && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block mb-1">
                Engineering Value & Business ROI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]">
                Problem, Architectural Solution & Measurable Impact
              </h2>
            </div>
            <span className="text-xs font-mono text-[#111111]/50 dark:text-[#FAF7F3]/50">
              Verified Metrics
            </span>
          </div>

          {/* Problem vs Solution Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-red-500/[0.04] dark:bg-red-500/[0.06] border border-red-500/20 space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold block">
                01. The Engineering Challenge
              </span>
              <p className="text-sm sm:text-base text-[#111111]/85 dark:text-[#FAF7F3]/85 leading-relaxed">
                {project.impact.challenge}
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border border-emerald-500/20 space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                02. Architectural Solution
              </span>
              <p className="text-sm sm:text-base text-[#111111]/85 dark:text-[#FAF7F3]/85 leading-relaxed">
                {project.impact.solution}
              </p>
            </div>
          </div>

          {/* Quantifiable Business ROI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {project.impact.roi.map((roi) => (
              <div
                key={roi.metric}
                className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#111111]/10 dark:border-white/10 space-y-2"
              >
                <span className="text-xs font-mono text-[#111111]/60 dark:text-[#FAF7F3]/60 uppercase tracking-wider block">
                  {roi.metric}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#111111] dark:text-white tracking-tight">
                  {roi.value}
                </div>
                <p className="text-xs text-[#111111]/70 dark:text-[#FAF7F3]/70 leading-relaxed">
                  {roi.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Case Study Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-none space-y-6 text-[#111111]/85 dark:text-[#FAF7F3]/85 text-base sm:text-lg md:text-[19px] leading-relaxed mb-16"
      >
        <p className="font-semibold text-[#111111] dark:text-white text-lg sm:text-xl">
          {project.summary}
        </p>

        {project.paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </motion.div>

      {/* Gallery Screenshots */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="space-y-10 mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#FAF7F3] tracking-tight">
            System Interfaces & Architecture
          </h2>

          {project.screenshots.map((shot, idx) => (
            <motion.div
              key={shot.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[20px] overflow-hidden bg-[#161616] shadow-xl border border-black/10 dark:border-white/10"
            >
              <div className="p-4 sm:p-5 bg-[#111111] border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#FAF7F3]">
                  {shot.title}
                </span>
                <span className="text-xs text-[#FAF7F3]/50 font-mono">
                  0{idx + 1} / 0{project.screenshots.length}
                </span>
              </div>
              <img
                src={shot.image}
                alt={shot.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-4 sm:p-5 bg-[#111111] text-xs text-[#FAF7F3]/70">
                {shot.caption}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom CTA Box */}
      <div className="rounded-[24px] sm:rounded-[32px] bg-[#141414] text-[#FAF7F3] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 border border-white/10 shadow-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          International Hiring & Engineering Roles
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Interested in bringing this architectural caliber to your team?
        </h3>
        <p className="text-sm sm:text-base text-[#FAF7F3]/70 max-w-lg leading-relaxed">
          Available for remote full-time software engineering roles, abroad relocation opportunities, or targeted backend optimization contracts.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              playSound('pop');
              setBookingOpen(true);
            }}
            className="px-6 py-3.5 rounded-full bg-white text-[#111111] font-semibold text-xs sm:text-sm tracking-wide uppercase hover:bg-[#FAF7F3] transition-all cursor-pointer shadow-lg active:scale-95 inline-flex items-center gap-2"
          >
            <span>Book a 15-Min Intro Call</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playSound('click');
              onContact();
            }}
            className="px-6 py-3.5 rounded-full bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/15 transition-all cursor-pointer border border-white/10"
          >
            <span>Send Project Inquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
