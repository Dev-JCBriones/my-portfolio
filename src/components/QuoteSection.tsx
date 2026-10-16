import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Sparkles, RotateCcw, Compass, ArrowDown, CheckCircle2 } from 'lucide-react';

interface WordProps {
  word: string;
  index: number;
  totalWords: number;
  progress: MotionValue<number>;
  replayActive: boolean;
  replayProgress: number;
}

const Word: React.FC<WordProps> = ({
  word,
  index,
  totalWords,
  progress,
  replayActive,
  replayProgress,
}) => {
  // Reveal range mapped across scroll progress.
  // Distribute so that all words finish before progress reaches 0.88,
  // ensuring the entire text is 100% fully illuminated well before and when scrolling past the text.
  const start = (index / totalWords) * 0.80;
  const end = Math.min(0.88, start + Math.max(0.04, 1.2 / totalWords));

  // Denis Gusev GSAP style scroll scrub
  const scrollOpacity = useTransform(
    progress,
    [start, end],
    [0.18, 1],
    { clamp: true }
  );
  const scrollY = useTransform(
    progress,
    [start, end],
    [4, 0],
    { clamp: true }
  );

  // When replay is triggered, evaluate replay progress override
  const isReplayLit = replayActive && replayProgress >= index;

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.08em] select-text">
      {/* Background silhouette so text structure is always legible */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none transition-opacity duration-300 text-white/15"
      >
        {word}
      </span>

      {/* Main illuminated word */}
      <motion.span
        style={
          replayActive
            ? {
                opacity: isReplayLit ? 1 : 0.18,
                transform: isReplayLit ? 'translateY(0px)' : 'translateY(4px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }
            : {
                opacity: scrollOpacity,
                y: scrollY,
              }
        }
        className="inline-block font-medium tracking-tight gusev-word transition-colors duration-200 hover:text-amber-400 cursor-default text-[#FAF7F3]"
      >
        {word}
      </motion.span>
    </span>
  );
};

export const QuoteSection: React.FC = () => {
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Raw text manifesto
  const rawText =
    "I specialize in backend development, building robust server-side systems using PHP (Laravel), and managing relational databases like PostgreSQL and MySQL within a Laragon environment. My expertise includes API engineering—designing RESTful APIs, handling full API documentation, and testing with Bruno—complemented by a foundational knowledge of JavaScript and Bootstrap to seamlessly bridge backend data with the user interface.";

  const words = rawText.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Scroll tracking targeted directly on the text container
  // Starts when top of text enters at 85% of viewport
  // Completes at 55% of viewport (middle of screen), ensuring full 100% completion before or when scrolling past
  const { scrollYProgress } = useScroll({
    target: textContainerRef,
    offset: ['start 85%', 'end 55%'],
  });

  // Replay animation state
  const [replayActive, setReplayActive] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [livePercent, setLivePercent] = useState(0);

  // Scaled scrub line progress
  const scrubScale = useTransform(scrollYProgress, [0, 0.88], [0, 1], { clamp: true });

  // Track live scroll progress percentage for the UI indicator
  useEffect(() => {
    const currentVal = scrollYProgress.get();
    if (typeof currentVal === 'number' && !replayActive) {
      setLivePercent(Math.min(100, Math.max(0, Math.round((currentVal / 0.88) * 100))));
    }

    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (!replayActive) {
        setLivePercent(Math.min(100, Math.max(0, Math.round((v / 0.88) * 100))));
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, replayActive]);

  // Handle Denis Gusev style GSAP staggered replay
  const handleReplay = () => {
    setReplayActive(true);
    setReplayProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setReplayProgress(current);
      setLivePercent(Math.round((current / totalWords) * 100));

      if (current >= totalWords) {
        clearInterval(interval);
        setTimeout(() => {
          setReplayActive(false);
        }, 1200);
      }
    }, 35); // 35ms stagger per word (fluid GSAP tempo)
  };

  const isFullyComplete = livePercent >= 100;

  return (
    <section
      id="quote-section"
      className="relative py-24 sm:py-32 w-full px-4 sm:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      {/* Ambient Radial Spotlight */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <div className="w-[680px] h-[380px] rounded-full bg-black/5 dark:bg-white/[0.03] blur-3xl" />
      </div>

      {/* Header bar with indicator & replay trigger */}
      <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full max-w-4xl mx-auto border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2.5 text-xs font-mono tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-semibold text-[#111111] dark:text-[#FAF7F3]">
            Core Engineering Philosophy
          </span>
          <span className="opacity-30">•</span>
          <span className="inline-flex items-center gap-1 opacity-70 font-mono text-[11px] lowercase text-amber-600 dark:text-amber-400">
            <Compass className="w-3 h-3" />
            gsap scroll reveal
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Scroll progress badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#111111]/70 dark:text-[#FAF7F3]/70 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {isFullyComplete ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
              <ArrowDown className="w-3 h-3 text-amber-500 animate-bounce" />
            )}
            <span>{livePercent}% illuminated</span>
          </div>

          <button
            onClick={handleReplay}
            title="Replay word-by-word reveal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-[#111111]/80 dark:text-[#FAF7F3]/80 hover:text-[#111111] dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3 h-3 ${replayActive ? 'animate-spin' : ''}`} />
            <span>{replayActive ? 'Revealing...' : 'Replay Reveal'}</span>
          </button>
        </div>
      </div>

      {/* Denis Gusev Word-by-Word Scroll Reveal Container */}
      <div ref={textContainerRef} className="w-full max-w-4xl mx-auto text-center sm:text-left">
        <h2 className="text-[clamp(1.28rem,2.85vw,2.35rem)] font-normal leading-[1.55] sm:leading-[1.62] tracking-[-0.015em]">
          {words.map((word, index) => (
            <Word
              key={`${index}-${word}`}
              word={word}
              index={index}
              totalWords={totalWords}
              progress={scrollYProgress}
              replayActive={replayActive}
              replayProgress={replayProgress}
            />
          ))}
        </h2>

        {/* Live Scroll Scrub Line */}
        <div className="mt-8 sm:mt-10 w-full h-[2px] bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            style={
              replayActive
                ? { width: `${(replayProgress / totalWords) * 100}%` }
                : { scaleX: scrubScale, transformOrigin: 'left' }
            }
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-sky-400"
          />
        </div>
      </div>

      {/* Architectural Footnote Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-[#111111]/70 dark:text-[#FAF7F3]/70"
      >
        <span className="px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xs hover:border-black/20 dark:hover:border-white/20 transition-colors">
          PHP 8.x / Laravel
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xs hover:border-black/20 dark:hover:border-white/20 transition-colors">
          PostgreSQL & MySQL
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xs hover:border-black/20 dark:hover:border-white/20 transition-colors">
          RESTful API Contracts
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xs hover:border-black/20 dark:hover:border-white/20 transition-colors">
          Bruno Automated Collections
        </span>
      </motion.div>
    </section>
  );
};
