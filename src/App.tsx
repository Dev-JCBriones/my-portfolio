import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BioSection } from './components/BioSection';
import { ArchitectureSandbox } from './components/ArchitectureSandbox';
import { TechStackGrid } from './components/TechStackGrid';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { QuoteSection } from './components/QuoteSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { FooterSection } from './components/FooterSection';
import { WorksView } from './components/WorksView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { CommandPalette } from './components/CommandPalette';
import { ResumeModal } from './components/ResumeModal';
import { BookingModal } from './components/BookingModal';
import { DeliveryStandardsSection } from './components/DeliveryStandardsSection';
import { DynamicParticleBackground } from './components/DynamicParticleBackground';

function PortfolioApp() {
  const [currentView, setCurrentView] = useState<'home' | 'work' | 'project'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('teleworkx-ai');

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigate = (view: 'home' | 'work' | 'project', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'home' && sectionId) {
      scrollToSection(sectionId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden bg-[#0E0E0E] text-[#FAF7F3] selection:bg-[#FAF7F3] selection:text-[#111111]">
      {/* Dynamic Twinkling Particle Canvas with Black & White Shifting Gradient */}
      <DynamicParticleBackground />

      {/* Fixed subtle noise grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.025] z-50 bg-noise"
        aria-hidden="true"
      />

      {/* Command Palette (Cmd + K) */}
      <CommandPalette onNavigate={handleNavigate} />

      {/* Curriculum Vitae Modal */}
      <ResumeModal />

      {/* 15-Minute Intro Call Booking Modal */}
      <BookingModal />

      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main View Router */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <HeroSection />

              {/* Bio & Flippable 3D Avatar */}
              <BioSection
                onContactClick={() => scrollToSection('contact')}
                onWorkClick={() => handleOpenProject('teleworkx-ai')}
              />

              {/* Engineered Technical Stack & System Blueprint */}
              <TechStackGrid />

              {/* Interactive Architecture & API Sandbox */}
              <ArchitectureSandbox />

              {/* Featured Projects with Metric Badges & Verified ROI */}
              <ProjectsSection
                onOpenProject={handleOpenProject}
                onViewAllWork={() => handleNavigate('work')}
              />

              {/* How I Work With Global Teams / International Remote Standards */}
              <DeliveryStandardsSection />

              {/* Career Journey & Timeline */}
              <ExperienceTimeline />

              {/* Services & Architectural Capabilities */}
              <ServicesSection />

              {/* Scroll-Driven Text Reveal */}
              <QuoteSection />

              {/* 3D Flip Testimonial Cards */}
              <TestimonialsSection />

              {/* Interactive Contact & Inquiry Form */}
              <ContactSection />
            </motion.div>
          )}

          {currentView === 'work' && (
            <motion.div
              key="work-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <WorksView
                onBack={() => handleNavigate('home')}
                onSelectProject={handleOpenProject}
              />
            </motion.div>
          )}

          {currentView === 'project' && (
            <motion.div
              key="project-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectDetailView
                projectId={selectedProjectId}
                onBack={() => handleNavigate('work')}
                onContact={() => handleNavigate('home', 'contact')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
