import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCw } from 'lucide-react';
import { testimonialsData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface TestimonialCardProps {
  testimonial: (typeof testimonialsData)[0];
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  const { playSound } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    playSound('flip');
    setIsFlipped((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-[380px] sm:h-[400px] w-full cursor-pointer perspective-1200"
      onMouseEnter={() => {
        playSound('flip');
        setIsFlipped(true);
      }}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={toggleFlip}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full transform-style-3d rounded-[24px] shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Front Face: Centered Company Logo (Default View) */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] bg-[#111111] dark:bg-[#161616] p-8 flex flex-col items-center justify-center border border-white/5"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10">
            <img
              src={testimonial.logo}
              alt={`${testimonial.name}'s company logo`}
              className="max-w-full max-h-full object-contain filter brightness-110"
            />
          </div>
          <span className="mt-4 text-xs tracking-wider uppercase text-[#FAF7F3]/50 font-mono">
            {testimonial.name}
          </span>
          <span className="text-[11px] text-[#FAF7F3]/30 mt-1">
            Verified Collaboration
          </span>

          <div className="absolute bottom-6 right-7 text-[#FAF7F3]/40 group-hover:text-[#FAF7F3]/80 transition-colors flex items-center gap-1 text-[11px]">
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flip</span>
          </div>
        </div>

        {/* Back Face: Testimonial Quote & Author details (Revealed on Hover) */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[24px] bg-[#111111] dark:bg-[#161616] p-7 sm:p-8 flex flex-col justify-between border border-white/5"
        >
          {/* Quote text */}
          <p className="text-base sm:text-[17px] text-[#FAF7F3]/90 leading-relaxed font-normal">
            "{testimonial.quote}"
          </p>

          {/* Author footer */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-3.5">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <div>
                <h4 className="text-sm font-semibold text-[#FAF7F3] leading-snug">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-[#FAF7F3]/60">
                  {testimonial.role}
                </p>
              </div>
            </div>

            <div className="text-[#FAF7F3]/40 group-hover:text-[#FAF7F3]/80 transition-colors flex items-center gap-1 text-[11px]">
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
          Social Proof & Endorsements
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]"
        >
          Testimonials
        </motion.h2>
      </div>

      {/* Grid of 4 flip cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {testimonialsData.map((item, index) => (
          <TestimonialCard key={item.id} testimonial={item} index={index} />
        ))}
      </div>
    </section>
  );
};
