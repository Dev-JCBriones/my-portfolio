import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { portfolioAssets, bioData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface BioSectionProps {
  onContactClick: () => void;
  onWorkClick: () => void;
}

export const BioSection: React.FC<BioSectionProps> = ({ onContactClick, onWorkClick }) => {
  const { playSound, setResumeOpen } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Detects when the bio section is active in the viewport
  const isInView = useInView(sectionRef, {
    amount: 0.2, // Triggers once 20% of section enters viewport (reliable on mobile & desktop)
  });

  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-flip when section is on screen, stay in this flip while staying in area, flip back when scrolled away
  useEffect(() => {
    if (isInView) {
      // Auto-flip to back face with a slight natural delay upon entering view
      const timer = setTimeout(() => {
        setIsFlipped(true);
        playSound('flip');
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // Flip back to front view when scrolled away to another area
      setIsFlipped(false);
    }
  }, [isInView, playSound]);

  return (
    <section
      ref={sectionRef}
      id="bio-section"
      className="relative py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Auto-Flipping Avatar Card (No hover required, automatic scroll-triggered flip) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-center justify-center w-full"
        >
          <div className="relative w-[260px] h-[320px] sm:w-[320px] sm:h-[390px] perspective-1200">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full relative transform-style-3d rounded-3xl shadow-xl transition-shadow duration-300 hover:shadow-2xl"
            >
              {/* Front Face: Portrait Front */}
              <div
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden bg-[#161616] border border-black/10 dark:border-white/10 shadow-inner"
              >
                <img
                  src={portfolioAssets.avatarBack}
                  alt="Portrait of JC – front view"
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Back Face: Portrait Back */}
              <div
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl overflow-hidden bg-[#161616] border border-black/10 dark:border-white/10 shadow-inner"
              >
                <img
                  src={portfolioAssets.avatarFront}
                  alt="Portrait of JC – back view"
                  className="w-full h-full object-cover object-center select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Bio Narrative & Quantitative Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6"
        >
          {/* Main Greeting & Bio Paragraphs */}
          <div className="space-y-5 text-lg sm:text-xl md:text-[22px] leading-relaxed text-[#111111]/90 dark:text-[#FAF7F3]/90 font-normal">
            <p>
              Hey! I’m <span className="font-bold text-[#111111] dark:text-white">{bioData.name}</span>, a software engineer based in{' '}
              <span className="font-semibold text-[#111111] dark:text-white">{bioData.location}</span>, currently architecting core backend infrastructure at{' '}
              <button
                onClick={() => {
                  playSound('click');
                  onWorkClick();
                }}
                className="font-bold text-[#111111] dark:text-white underline decoration-2 underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer inline-flex items-center gap-0.5"
              >
                <span>{bioData.currentCompany}</span>
                <ArrowUpRight className="w-4 h-4 inline" />
              </button>
              , an enterprise job portal and workforce platform connecting international companies with top professionals.
            </p>

            <p>
              I specialize in backend architecture and high-performance server logic—building robust APIs with <strong className="font-semibold text-[#111111] dark:text-white">PHP (Laravel)</strong>, fine-tuning relational <strong className="font-semibold text-[#111111] dark:text-white">PostgreSQL and MySQL</strong> databases, and authoring rigorous automated test suites.
            </p>

            <p className="text-base sm:text-lg text-[#111111]/75 dark:text-[#FAF7F3]/75 leading-relaxed">
              My background bridges physical network infrastructure and analytical BPO operations with modern software engineering. I bring structured discipline, data integrity, and clear asynchronous communication to fast-paced global distributed teams.
            </p>
          </div>

          {/* Quick Quantitative Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#111111]/10 dark:border-white/10">
            {bioData.stats.map((stat) => (
              <div key={stat.label} className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#111111] dark:text-[#FAF7F3]">
                  {stat.value}
                </span>
                <p className="text-xs text-[#111111]/60 dark:text-[#FAF7F3]/60 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                onContactClick();
              }}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] font-semibold text-sm sm:text-base hover:bg-black dark:hover:bg-white transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => {
                playSound('pop');
                setResumeOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#111111] dark:text-[#FAF7F3] font-semibold text-sm transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Resume / CV</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
