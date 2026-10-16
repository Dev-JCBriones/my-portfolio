import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Copy, Check, Download, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { bioData, experienceTimeline, techSkills } from '../data/portfolioData';
import avatarFront from '../assets/images/avatar_front.png';

export const ResumeModal: React.FC = () => {
  const { resumeOpen, setResumeOpen, playSound } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!resumeOpen) return null;

  const handleCopy = () => {
    playSound('click');
    const textResume = `
JOHN CARLO BRIONES (Dev JC)
Software Engineer | Backend & Full-Stack Specialist
Email: ${bioData.email} | Location: ${bioData.location}
Current Company: TeleworkX.AI

PROFESSIONAL SUMMARY:
Backend-focused software engineer with strong technical foundations in PHP (Laravel), PostgreSQL, MySQL, and RESTful API engineering. Brings structural precision, data integrity, and analytical discipline cultivated across physical network infrastructure and high-throughput web platforms.

CORE TECHNICAL SKILLS:
- Backend: PHP 8.x, Laravel 11.x, RESTful API Design, Microservices, MVC Architecture
- Databases: PostgreSQL, MySQL, Relational Schema Design, Indexing, Query Optimization
- Testing & Tools: Bruno API Testing, Postman, Git, Laragon, Linux, CLI
- Frontend & Reactive: Laravel Livewire, Alpine.js, React, Tailwind CSS, TypeScript

EXPERIENCE:
${experienceTimeline.map(exp => `
${exp.role} — ${exp.company} (${exp.period})
${exp.description}
Achievements:
${exp.achievements.map(a => `• ${a}`).join('\n')}
Tech: ${exp.technologies.join(', ')}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setResumeOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF7F3] dark:bg-[#111111] text-[#111111] dark:text-[#FAF7F3] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-black/10 dark:border-white/10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="font-bold text-base sm:text-lg whitespace-nowrap truncate">
                Curriculum Vitae
              </span>
              <span className="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handleCopy}
                title="Copy full resume text"
                aria-label="Copy full resume text"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrint}
                title="Print or export PDF"
                aria-label="Print or export PDF"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                onClick={() => setResumeOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-white"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Resume Content */}
          <div className="overflow-y-auto p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 print:p-0">
            {/* Candidate Identity */}
            <div className="border-b border-black/10 dark:border-white/10 pb-5 sm:pb-6 flex items-start gap-3.5 sm:gap-6">
              <img
                src={avatarFront}
                alt="John Carlo Briones"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-[center_20%] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-[#FAF7F3] leading-snug">
                  John Carlo Briones
                </h1>
                <p className="text-xs sm:text-base font-medium sm:font-semibold text-[#111111]/80 dark:text-[#FAF7F3]/80 mt-0.5 sm:mt-1 leading-snug">
                  Software Engineer — Backend & API Specialist
                </p>
                
                {/* Contact metadata strip */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-3.5 mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#111111]/70 dark:text-[#FAF7F3]/70 font-mono">
                  <a
                    href={`mailto:${bioData.email}`}
                    className="inline-flex items-center gap-1.5 hover:underline text-[#111111]/90 dark:text-[#FAF7F3]/90"
                  >
                    <Mail className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{bioData.email}</span>
                  </a>
                  
                  <span className="hidden sm:inline opacity-30">•</span>
                  
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{bioData.location}</span>
                  </span>
                  
                  <span className="hidden sm:inline opacity-30">•</span>
                  
                  <a
                    href="https://app.teleworkx.ai/login"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline text-[#111111]/90 dark:text-[#FAF7F3]/90"
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>app.teleworkx.ai</span>
                  </a>
                </div>
              </div>
            </div>

          {/* Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase">
                Executive Summary
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#111111]/85 dark:text-[#FAF7F3]/85">
                Backend-focused software engineer with substantial experience engineering scalable, robust server architecture, database schemas, and RESTful APIs with PHP (Laravel). Distinctive technical perspective spanning physical enterprise network infrastructure and rigorous operational analytics, ensuring structural precision, data integrity, and clean code maintainability.
              </p>
            </div>

            {/* Core Competencies */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase">
                Technical Proficiencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <span className="font-semibold block mb-1">Backend & Server Architecture</span>
                  <p className="text-xs text-[#111111]/70 dark:text-[#FAF7F3]/70">
                    PHP 8.x, Laravel 11, MVC, RESTful APIs, Middleware, Service Containers, Queues & Jobs
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <span className="font-semibold block mb-1">Database & Storage Systems</span>
                  <p className="text-xs text-[#111111]/70 dark:text-[#FAF7F3]/70">
                    PostgreSQL 16, MySQL 8, Relational Schema Normalization, Foreign Key Constraints, Indexing
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <span className="font-semibold block mb-1">Testing & Developer Tooling</span>
                  <p className="text-xs text-[#111111]/70 dark:text-[#FAF7F3]/70">
                    Bruno Collections, Postman Newman, Laragon Virtual Host Isolation, Git Branching
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <span className="font-semibold block mb-1">Frontend & Client Bridging</span>
                  <p className="text-xs text-[#111111]/70 dark:text-[#FAF7F3]/70">
                    Laravel Livewire 3, JavaScript (ES6+), Modern React, Tailwind CSS, Bootstrap
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experienceTimeline.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">{exp.role}</h3>
                        <p className="text-xs sm:text-sm font-medium text-[#111111]/75 dark:text-[#FAF7F3]/75">
                          {exp.company} • {exp.location}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[#111111]/50 dark:text-[#FAF7F3]/50 mt-1 sm:mt-0">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm text-[#111111]/80 dark:text-[#FAF7F3]/80 leading-relaxed">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
