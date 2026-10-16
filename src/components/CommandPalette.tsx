import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  FileText, 
  Volume2, 
  VolumeX, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  Layers, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  onNavigate: (view: 'home' | 'work' | 'project', sectionId?: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'External';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const { 
    searchOpen, 
    setSearchOpen, 
    soundEnabled, 
    toggleSound, 
    playSound, 
    setResumeOpen,
    showToast 
  } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      playSound('pop');
    }
  }, [searchOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText('brionesjc050@gmail.com');
    setCopiedEmail(true);
    playSound('click');
    showToast('Email copied to clipboard!', 'copy');
    setTimeout(() => {
      setCopiedEmail(false);
      setSearchOpen(false);
    }, 1200);
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-hero',
      title: 'Go to Top / Hero',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'hero-section');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-bio',
      title: 'Go to About / Bio',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'bio-section');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-sandbox',
      title: 'Go to Architecture & API Sandbox',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'api-sandbox');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-tech',
      title: 'Go to Technical Stack',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'tech-stack');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-experience',
      title: 'Go to Career Journey & Timeline',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'experience-section');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-services',
      title: 'Go to Services',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'services');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-projects',
      title: 'Go to Featured Projects',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'projects-section');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-work-view',
      title: 'View All Works (Gallery View)',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => {
        onNavigate('work');
        setSearchOpen(false);
      }
    },
    {
      id: 'nav-contact',
      title: 'Go to Contact Form',
      category: 'Navigation',
      icon: <Mail className="w-4 h-4" />,
      action: () => {
        onNavigate('home', 'contact');
        setSearchOpen(false);
      }
    },

    // Actions
    {
      id: 'act-resume',
      title: 'View Resume & Credentials',
      category: 'Actions',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        setSearchOpen(false);
        setResumeOpen(true);
      }
    },

    {
      id: 'act-sound',
      title: `Turn Audio Micro-haptics ${soundEnabled ? 'OFF' : 'ON'}`,
      category: 'Actions',
      icon: soundEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />,
      action: () => {
        toggleSound();
        showToast(soundEnabled ? 'Audio feedback muted' : 'Audio feedback enabled', 'info');
        setSearchOpen(false);
      }
    },
    {
      id: 'act-email',
      title: copiedEmail ? 'Email Copied!' : 'Copy Email (brionesjc050@gmail.com)',
      category: 'Actions',
      icon: copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Mail className="w-4 h-4" />,
      action: copyEmail
    },

    // External
    {
      id: 'ext-telework',
      title: 'Visit TeleworkX.AI (Current Platform)',
      category: 'External',
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => {
        window.open('https://app.teleworkx.ai/login', '_blank');
        setSearchOpen(false);
      }
    }
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      playSound('click');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      playSound('click');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#111111] dark:bg-[#161616] text-[#FAF7F3] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or jump to section..."
                className="w-full bg-transparent text-[#FAF7F3] placeholder:text-white/40 text-sm sm:text-base focus:outline-none"
              />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-white/50">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-white/5">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-white/40">
                  No matching command or section found.
                </div>
              ) : (
                filtered.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                        isSelected
                          ? 'bg-white/15 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isSelected ? 'text-white' : 'text-white/50'}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-[11px] font-mono tracking-wider text-white/40 uppercase">
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Helper */}
            <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Dev JC Command Bar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
