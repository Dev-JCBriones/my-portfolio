import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Play, Copy, Check, Server, Clock, ShieldCheck, ArrowRight, Zap, Code2, Database } from 'lucide-react';
import { interactiveEndpoints } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const ArchitectureSandbox: React.FC = () => {
  const { playSound } = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState(interactiveEndpoints[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(24);
  const [activeTab, setActiveTab] = useState<'response' | 'headers' | 'curl'>('response');

  const handleSend = (endpoint = selectedEndpoint) => {
    playSound('click');
    setIsLoading(true);
    const mockLatency = Math.floor(Math.random() * 22) + 12;
    setTimeout(() => {
      setIsLoading(false);
      setExecutionTime(mockLatency);
      setSelectedEndpoint(endpoint);
    }, 260);
  };

  const copyCurl = () => {
    playSound('pop');
    const curl = `curl -X ${selectedEndpoint.method} "https://app.teleworkx.ai${selectedEndpoint.path}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer sanctum_demo_token"`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 1500);
  };

  // High-craft syntax highlighter for JSON
  const renderHighlightedJson = (obj: unknown) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    const lines = jsonStr.split('\n');

    return (
      <div className="font-mono text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          // Identify key-value pairs
          const keyMatch = line.match(/^(\s*)(".*?"):(.*)$/);
          if (keyMatch) {
            const indent = keyMatch[1];
            const key = keyMatch[2];
            const val = keyMatch[3];

            let coloredVal: React.ReactNode = val;
            const trimmed = val.trim();

            if (trimmed.startsWith('"')) {
              coloredVal = <span className="text-emerald-300">{val}</span>;
            } else if (!isNaN(Number(trimmed.replace(/,$/, '')))) {
              coloredVal = <span className="text-amber-300 font-semibold">{val}</span>;
            } else if (trimmed.startsWith('true') || trimmed.startsWith('false')) {
              coloredVal = <span className="text-purple-300 font-bold">{val}</span>;
            } else if (trimmed.startsWith('null')) {
              coloredVal = <span className="text-rose-300 font-medium">{val}</span>;
            }

            return (
              <div key={idx} className="hover:bg-white/[0.03] px-2 py-0.5 rounded transition-colors">
                <span className="text-white/30 mr-3 select-none text-[11px] tabular-nums inline-block w-5 text-right">
                  {idx + 1}
                </span>
                <span>{indent}</span>
                <span className="text-sky-300 font-medium">{key}</span>:
                {coloredVal}
              </div>
            );
          }

          return (
            <div key={idx} className="hover:bg-white/[0.03] px-2 py-0.5 rounded transition-colors text-white/50">
              <span className="text-white/30 mr-3 select-none text-[11px] tabular-nums inline-block w-5 text-right">
                {idx + 1}
              </span>
              <span>{line}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="api-sandbox" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
            Interactive Architecture & Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]">
            Test Live API Endpoints
          </h2>
        </div>
        <p className="text-sm text-[#111111]/70 dark:text-[#FAF7F3]/70 max-w-md leading-relaxed">
          Inspect JC's backend contracts, response payload architecture, and real-time query optimization benchmarks in an interactive developer console.
        </p>
      </div>

      {/* Terminal Sandbox Shell */}
      <div className="rounded-[24px] sm:rounded-[28px] bg-[#0E0E0E] text-[#FAF7F3] border border-white/10 shadow-2xl overflow-hidden">
        {/* Terminal Window Header Bar */}
        <div className="px-5 py-3.5 bg-[#141414] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 font-mono text-xs text-white/50 hidden sm:inline-block">
              jc-backend-workstation — Laravel 11.x / PostgreSQL 16
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={copyCurl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer border border-white/5 active:scale-95"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">cURL Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white/60" />
                  <span>Copy cURL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sandbox Body: Split Column (Endpoint Selector + Live Console) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Left: Endpoint Selector List */}
          <div className="lg:col-span-5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10 space-y-2.5 bg-[#111111]/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white/40 block">
                Available Endpoints
              </span>
              <span className="text-[11px] font-mono text-emerald-400/80">
                PSR-12 / RESTful
              </span>
            </div>

            {interactiveEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.path === ep.path;
              const isPost = ep.method === 'POST';

              return (
                <div
                  key={ep.path}
                  onClick={() => handleSend(ep)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                    isSelected
                      ? 'bg-white/10 border-white/20 text-white shadow-md ring-1 ring-white/10'
                      : 'bg-white/[0.03] border-transparent text-white/70 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isPost
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-semibold text-white/90">{ep.path}</span>
                    </div>

                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-emerald-400' : 'opacity-0'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1.5 line-clamp-1">
                    {ep.description}
                  </p>
                </div>
              );
            })}

            <div className="pt-3">
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-white text-[#111111] hover:bg-[#FAF7F3] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Dispatch Request</span>
              </button>
            </div>
          </div>

          {/* Right: Response Output Viewer */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#080808]">
            {/* Action Bar */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('response')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    activeTab === 'response'
                      ? 'text-white font-bold border-b-2 border-emerald-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Body (JSON)
                </button>
                <button
                  onClick={() => setActiveTab('headers')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    activeTab === 'headers'
                      ? 'text-white font-bold border-b-2 border-emerald-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Headers (HTTP)
                </button>
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`cursor-pointer transition-colors pb-1 ${
                    activeTab === 'curl'
                      ? 'text-white font-bold border-b-2 border-emerald-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  cURL Equivalent
                </button>
              </div>

              <div className="flex items-center gap-3 text-white/60">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>200 OK</span>
                </span>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1 tabular-nums font-medium text-white/80">
                  <Clock className="w-3.5 h-3.5 text-white/50" />
                  <span>{executionTime}ms</span>
                </span>
              </div>
            </div>

            {/* Code Output Viewer */}
            <div className="p-4 sm:p-5 overflow-x-auto flex-1 select-text">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 flex flex-col items-center justify-center gap-3 text-white/50 font-mono text-xs"
                  >
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Executing backend controller dispatch...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${selectedEndpoint.path}-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === 'response' && (
                      <div>{renderHighlightedJson(selectedEndpoint.response)}</div>
                    )}

                    {activeTab === 'headers' && (
                      <div className="space-y-1.5 text-xs sm:text-sm font-mono text-white/70 py-2">
                        <div className="text-emerald-400 font-semibold">HTTP/1.1 200 OK</div>
                        <div>Date: {new Date().toUTCString()}</div>
                        <div>Server: Laragon / Nginx 1.25.3 (PHP 8.3.6-FPM)</div>
                        <div>Content-Type: application/json; charset=utf-8</div>
                        <div>X-Framework: Laravel 11.2 (Service-Repository Pattern)</div>
                        <div>X-RateLimit-Limit: 120</div>
                        <div>X-RateLimit-Remaining: 119</div>
                        <div>X-Response-Time: {executionTime}ms</div>
                        <div>Cache-Control: no-cache, private</div>
                        <div>Access-Control-Allow-Origin: *</div>
                      </div>
                    )}

                    {activeTab === 'curl' && (
                      <div className="font-mono text-xs leading-relaxed text-emerald-300 bg-white/5 p-4 rounded-xl border border-white/5">
                        <pre className="whitespace-pre-wrap">
                          {`curl -X ${selectedEndpoint.method} "https://app.teleworkx.ai${selectedEndpoint.path}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer sanctum_demo_token"`}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status bar */}
            <div className="px-5 py-2.5 bg-[#0C0C0C] border-t border-white/10 text-[11px] font-mono text-white/50 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Endpoint: {selectedEndpoint.path}</span>
              </span>
              <span>RESTful Architecture · Bruno Validated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
