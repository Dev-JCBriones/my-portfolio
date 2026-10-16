import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Search, Volume2, VolumeX, FileText, X, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import brandLogoDark from '../assets/images/brand_logo_dark.png';

interface NavbarProps {
  currentView: 'home' | 'work' | 'project';
  onNavigate: (view: 'home' | 'work' | 'project', sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { 
    soundEnabled, 
    toggleSound, 
    playSound, 
    setSearchOpen, 
    setResumeOpen,
    showToast 
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero-section');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section ScrollSpy for dynamic nav link indicator
  useEffect(() => {
    if (currentView !== 'home') return;

    const sectionIds = ['hero-section', 'tech-stack', 'api-sandbox', 'services', 'contact'];
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [currentView]);

  // Close drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const primaryNavItems = [
    { label: 'Home', view: 'home' as const, id: 'hero-section' },
    { label: 'Skills', view: 'home' as const, id: 'tech-stack' },
    { label: 'API Sandbox', view: 'home' as const, id: 'api-sandbox' },
    { label: 'Works', view: 'work' as const, id: 'work-section' },
    { label: 'Services', view: 'home' as const, id: 'services' },
    { label: 'Contact', view: 'home' as const, id: 'contact' },
  ];

  const devSubSections = [
    { label: 'API Sandbox', id: 'api-sandbox' },
    { label: 'Tech Stack', id: 'tech-stack' },
    { label: 'Career Journey', id: 'experience-section' },
  ];

  const handleItemClick = (view: 'home' | 'work' | 'project', id?: string) => {
    playSound('click');
    setIsOpen(false);
    onNavigate(view, id);
  };

  const handleToggleSound = () => {
    toggleSound();
    showToast(soundEnabled ? 'Audio feedback muted' : 'Audio feedback enabled', 'info');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 pt-3 sm:pt-4 pb-2 pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full max-w-6xl flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-[20px] transition-all duration-300 ${
            scrolled
              ? 'bg-[#111111]/95 dark:bg-[#161616]/95 backdrop-blur-md shadow-2xl border border-white/10'
              : 'bg-[#111111] dark:bg-[#161616] shadow-lg border border-transparent'
          }`}
        >
          {/* Brand Logo */}
          <button
            onClick={() => handleItemClick('home', 'hero-section')}
            className="group flex items-center gap-2.5 text-left cursor-pointer transition-transform active:scale-95 shrink-0"
          >
            <img
              src={brandLogoDark}
              alt="Dev JC logo"
              className="w-7 h-7 object-contain rounded-lg"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#FAF7F3] group-hover:text-white transition-colors">
              Dev JC
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-3.5 lg:gap-6 xl:gap-7">
            {primaryNavItems.map((item) => {
              const isActive =
                currentView === 'work'
                  ? item.view === 'work'
                  : currentView === 'home' && activeSection === item.id;

              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.view, item.id)}
                  className={`text-xs xl:text-sm font-medium tracking-wide transition-all cursor-pointer relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#FAF7F3]/65 hover:text-[#FAF7F3]'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Controls (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search (Cmd+K) */}
            <button
              onClick={() => {
                playSound('pop');
                setSearchOpen(true);
              }}
              title="Quick Search (Cmd+K)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] text-white/50">⌘K</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={`Audio feedback: ${soundEnabled ? 'Enabled' : 'Disabled'}`}
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-white/40" />
              )}
            </button>

            {/* Resume CV Button */}
            <button
              onClick={() => {
                playSound('pop');
                setResumeOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF7F3] text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleItemClick('home', 'contact')}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#FAF7F3] text-[#111111] hover:bg-white hover:shadow-md transition-all cursor-pointer active:scale-95 ml-1"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </button>
          </div>

          {/* Mobile Right Controls: Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                setIsOpen(!isOpen);
              }}
              aria-label="Toggle navigation menu"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer Menu & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 md:hidden bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="fixed inset-x-3.5 top-18 z-40 md:hidden bg-[#111111] dark:bg-[#161616] text-[#FAF7F3] border border-white/15 rounded-[22px] p-5 shadow-2xl overflow-y-auto max-h-[82vh]"
            >
              {/* Primary Navigation Links */}
              <div className="space-y-1">
                {primaryNavItems.map((item, idx) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleItemClick(item.view, item.id)}
                    className="w-full text-left text-lg font-semibold text-[#FAF7F3] hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </motion.button>
                ))}
              </div>

              {/* Quick Developer Sections */}
              <div className="pt-4 mt-3 border-t border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block mb-2 px-3">
                  Developer Sections
                </span>
                <div className="flex flex-wrap gap-2 px-1">
                  {devSubSections.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleItemClick('home', sub.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility Tools Row */}
              <div className="pt-4 mt-3 border-t border-white/10 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => setSearchOpen(true), 150);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer gap-1"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[11px] font-mono">Search ⌘K</span>
                </button>

                <button
                  onClick={handleToggleSound}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer gap-1"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white/40" />
                  )}
                  <span className="text-[11px] font-mono">{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => setResumeOpen(true), 150);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer gap-1"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[11px] font-mono">View CV</span>
                </button>
              </div>

              {/* Bottom Primary CTA */}
              <div className="pt-4 mt-2">
                <button
                  onClick={() => handleItemClick('home', 'contact')}
                  className="w-full py-3 rounded-xl bg-[#FAF7F3] text-[#111111] font-semibold text-sm tracking-wide text-center cursor-pointer shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
