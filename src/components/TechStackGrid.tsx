import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Database,
  Code,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Workflow,
  ArrowRight,
  ExternalLink,
  X,
  FileCode2,
  Activity,
  Zap,
} from 'lucide-react';
import { techSkills } from '../data/portfolioData';
import { TechSkill } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';

export const TechStackGrid: React.FC = () => {
  const { playSound } = useTheme();
  const [filter, setFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'matrix' | 'blueprint'>('matrix');
  const [selectedSkill, setSelectedSkill] = useState<TechSkill | null>(techSkills[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const categories = [
    'All',
    'Backend & APIs',
    'Databases & Querying',
    'Tools & Environments',
    'Frontend & Integration',
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const filteredSkills = filter === 'All'
    ? techSkills
    : techSkills.filter((s) => s.category === filter);

  const copyCode = (codeText: string) => {
    playSound('pop');
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <section id="tech-stack" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
            Engineered Core Competencies
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]">
            Skills & Architecture
          </h2>
        </div>

        {/* View Mode Switcher: Matrix vs System Blueprint */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 self-start md:self-auto">
          <button
            onClick={() => {
              playSound('click');
              setViewMode('matrix');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'matrix'
                ? 'bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] shadow-sm font-semibold'
                : 'text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-[#FAF7F3]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skills Matrix</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setViewMode('blueprint');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'blueprint'
                ? 'bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] shadow-sm font-semibold'
                : 'text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-[#FAF7F3]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Architecture Blueprint</span>
          </button>
        </div>
      </div>

      {viewMode === 'matrix' ? (
        <>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playSound('click');
                  setFilter(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] font-semibold shadow-sm'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#111111]/70 dark:text-[#FAF7F3]/70 hover:text-[#111111] dark:hover:text-[#FAF7F3] border border-black/5 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main 2-Column Split: Interactive Cards on Left + Live Architecture Inspector on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Skills Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSkills.map((skill, index) => {
                const isSelected = selectedSkill?.name === skill.name;

                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    onClick={() => {
                      playSound('click');
                      setSelectedSkill(skill);
                    }}
                    className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'bg-[#111111] text-[#FAF7F3] border-[#111111] dark:bg-white dark:text-[#111111] dark:border-white ring-2 ring-black/10 dark:ring-white/20'
                        : 'bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] border-[#111111]/10 dark:border-white/10 text-[#111111] dark:text-[#FAF7F3]'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon + Level */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-white/10 dark:bg-black/10 text-white dark:text-black'
                              : 'bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111]'
                          }`}
                        >
                          {getIcon(skill.icon)}
                        </div>

                        <span
                          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-400/20 text-emerald-300 dark:text-emerald-800'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{skill.level}</span>
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="text-base font-bold tracking-tight">
                        {skill.name}
                      </h3>

                      {/* Description */}
                      <p
                        className={`mt-1.5 text-xs leading-relaxed line-clamp-2 ${
                          isSelected ? 'text-white/80 dark:text-black/75' : 'text-[#111111]/70 dark:text-[#FAF7F3]/70'
                        }`}
                      >
                        {skill.description}
                      </p>
                    </div>

                    {/* Bottom Row: Category & Inspect Prompt */}
                    <div
                      className={`mt-4 pt-3 border-t text-[11px] font-mono flex items-center justify-between ${
                        isSelected
                          ? 'border-white/10 dark:border-black/10 text-white/70 dark:text-black/70'
                          : 'border-black/5 dark:border-white/5 text-[#111111]/50 dark:text-[#FAF7F3]/50'
                      }`}
                    >
                      <span>{skill.category}</span>
                      <span className="flex items-center gap-0.5 font-sans font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Live Architecture & Production Code Inspector */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                {selectedSkill && (
                  <motion.div
                    key={selectedSkill.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[24px] bg-[#121212] text-[#FAF7F3] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Tag & Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center">
                            {getIcon(selectedSkill.icon)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                              Production Depth
                            </span>
                            <h4 className="text-lg font-bold text-white tracking-tight">
                              {selectedSkill.name}
                            </h4>
                          </div>
                        </div>

                        {selectedSkill.metrics && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20 text-right shrink-0">
                            Verified Metric
                          </span>
                        )}
                      </div>

                      {/* Real Production Metric Box */}
                      {selectedSkill.metrics && (
                        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-xs text-emerald-300">
                          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium">{selectedSkill.metrics}</span>
                        </div>
                      )}

                      {/* Architectural Patterns */}
                      {selectedSkill.patterns && (
                        <div className="mt-4 space-y-1.5">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                            Core Architecture Patterns
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSkill.patterns.map((pat) => (
                              <span
                                key={pat}
                                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-white/80 border border-white/10"
                              >
                                {pat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code Snippet Window */}
                      {selectedSkill.codeSnippet && (
                        <div className="mt-5 rounded-xl bg-[#090909] border border-white/10 overflow-hidden">
                          {/* Code Header Bar */}
                          <div className="px-3.5 py-2 bg-[#161616] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-white/70">
                              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="truncate">{selectedSkill.codeSnippet.filename}</span>
                            </div>

                            <button
                              onClick={() => copyCode(selectedSkill.codeSnippet!.code)}
                              className="inline-flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedCode ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Code Content */}
                          <div className="p-3.5 font-mono text-[11px] leading-relaxed text-emerald-300/90 overflow-x-auto max-h-[220px] bg-[#070707]">
                            <pre className="whitespace-pre">
                              <code>{selectedSkill.codeSnippet.code}</code>
                            </pre>
                          </div>

                          {/* Explanation */}
                          <div className="p-3 bg-[#111111] border-t border-white/5 text-[11px] text-white/60 leading-relaxed">
                            <strong className="text-white/80 font-semibold block mb-0.5">
                              Architectural Rationale:
                            </strong>
                            {selectedSkill.codeSnippet.explanation}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                      <span>Click any skill on the left to inspect its implementation.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        /* Architecture Blueprint View: Visual High-Level Diagram */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] bg-[#121212] text-[#FAF7F3] border border-white/10 p-6 sm:p-10 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                TeleworkX.AI Production Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                High-Volume Distributed Backend Pipeline
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 self-start md:self-auto">
              SLA: 99.98% Uptime · P95: &lt;45ms
            </span>
          </div>

          {/* Blueprint Nodes Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* Stage 1: Ingestion & Gateway */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-2">
                  01. Ingestion Layer
                </span>
                <h4 className="text-base font-bold text-white mb-1">
                  Nginx & SSL Gateway
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Reverse proxy termination, rate limiting, and sub-domain wildcard routing for client tenants.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-white/50 space-y-1">
                <div>• SSL / HTTP/2 Handshake</div>
                <div>• Rate-Limiter (120 req/min)</div>
                <div>• Sanctum Token Auth</div>
              </div>
            </div>

            {/* Stage 2: Application Logic */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block mb-2">
                  02. Backend Service
                </span>
                <h4 className="text-base font-bold text-white mb-1">
                  Laravel 11 REST API
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Decoupled service-repository design pattern, DTO validation, and atomic database transaction isolation.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-white/50 space-y-1">
                <div>• Clean Domain Services</div>
                <div>• RFC-7807 Error Responses</div>
                <div>• Zero-Downtime Releases</div>
              </div>
            </div>

            {/* Stage 3: Async Queue Broker */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-2">
                  03. Async Queues
                </span>
                <h4 className="text-base font-bold text-white mb-1">
                  Redis Worker Pool
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Offloads candidate indexing, email dispatches, and heavy document processing outside request cycles.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-white/50 space-y-1">
                <div>• Redis Priority Queues</div>
                <div>• Idempotency Deduplication</div>
                <div>• Automatic Retry Backoff</div>
              </div>
            </div>

            {/* Stage 4: Database & Testing */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-2">
                  04. Relational Storage
                </span>
                <h4 className="text-base font-bold text-white mb-1">
                  PostgreSQL 16 & Bruno
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Composite indexing, connection pooling, and 100% automated regression assertions before deployment.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-white/50 space-y-1">
                <div>• Composite Partial Indexes</div>
                <div>• EXPLAIN ANALYZE tuning</div>
                <div>• Bruno CI/CD Test Pipeline</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Production Proven: Powering 15,000+ candidates and 30+ endpoints on TeleworkX.AI.</span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                setViewMode('matrix');
              }}
              className="text-xs font-semibold text-white hover:underline cursor-pointer self-start sm:self-auto"
            >
              ← Back to Skills Matrix
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};
