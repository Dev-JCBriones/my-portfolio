import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Send, Copy, Check, Mail, AlertCircle, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';
import { socialLinks, bioData } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ContactSection: React.FC = () => {
  const { playSound, setBookingOpen, showToast } = useTheme();
  const [projectType, setProjectType] = useState<string>('Backend & API');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    projectType: string;
    project: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const projectTypes = [
    'Backend & API',
    'Database Optimization',
    'Full-Stack Web App',
    'Technical Consultation'
  ];

  const quickTemplates = [
    { label: 'Laravel & REST API', text: 'Hi JC, we are looking for a software engineer to design and develop robust backend APIs with PHP (Laravel) and database architecture.' },
    { label: 'Database Optimization', text: 'Hi JC, we need an experienced engineer to inspect, index, and tune our PostgreSQL / MySQL database queries for peak throughput.' },
    { label: 'Full-Stack Web App', text: 'Hi JC, we have a platform build and need end-to-end engineering from server-side logic to clean frontend UI.' },
    { label: 'Qatar Onsite / Relocation', text: 'Hi JC, we have an exciting engineering opportunity open for onsite / international employment and would like to connect.' },
  ];

  const handleCopyEmail = () => {
    playSound('pop');
    navigator.clipboard.writeText(bioData.email);
    setCopiedEmail(true);
    showToast(`Email copied: ${bioData.email}`, 'copy');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!projectType) {
      newErrors.projectType = 'Please select a project category to continue';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required. Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@company.com).';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Project details are required. Please describe your project.';
    } else if (formData.project.trim().length < 5) {
      newErrors.project = 'Please provide a brief description (minimum 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playSound('pop');
      return;
    }

    playSound('click');
    setIsSubmitting(true);
    setSubmitError(null);

    const targetEmail = bioData.email; // brionesjc050@gmail.com
    const nameVal = formData.name.trim();
    const emailVal = formData.email.trim();
    const messageVal = formData.project.trim();

    try {
      // Direct email delivery via FormSubmit AJAX endpoint
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          service_category: projectType,
          message: messageVal,
          _subject: `New Project Inquiry: [${projectType}] from ${nameVal}`,
          _replyto: emailVal,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success === 'true' || result.success === true) {
        setSubmittedData({
          name: nameVal,
          email: emailVal,
          projectType,
          project: messageVal,
        });
        setIsSubmitted(true);
        playSound('pop');
        setFormData({ name: '', email: '', project: '' });
        setErrors({});
      } else {
        throw new Error(result.message || 'Server returned an error');
      }
    } catch (err: any) {
      // In case of ad-blocker or strict network policy preventing cross-origin AJAX,
      // save the submitted data so the user can easily dispatch via 1-click mailto
      setSubmitError(
        'Notice: Automatic delivery was interrupted (possibly due to an ad blocker or network policy). You can click below to open your email client directly to ' + targetEmail + '.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDirectMailtoUrl = () => {
    const name = formData.name || submittedData?.name || '';
    const email = formData.email || submittedData?.email || '';
    const type = projectType || submittedData?.projectType || 'Project Inquiry';
    const msg = formData.project || submittedData?.project || '';

    const subject = encodeURIComponent(`Project Inquiry [${type}] - from ${name || 'Client'}`);
    const body = encodeURIComponent(
      `Hi JC,\n\nI would like to inquire about working together:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Service: ${type}\n\n` +
      `Project Details:\n${msg}\n\n` +
      `Sent via Dev JC Portfolio Form`
    );

    return `mailto:${bioData.email}?subject=${subject}&body=${body}`;
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'LinkedIn': return <LinkedInIcon />;
      case 'GitHub': return <GithubIcon />;
      default: return null;
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading, Direct Email, Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-7"
        >
          <div>
            <span className="text-xs font-mono font-semibold tracking-widest text-[#111111]/50 dark:text-[#FAF7F3]/50 uppercase block mb-2">
              Get In Touch
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] dark:text-[#FAF7F3]">
              Let’s talk.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#111111]/70 dark:text-[#FAF7F3]/70 leading-relaxed max-w-md">
              Have a platform to build, backend APIs to scale, or need senior software engineering support? Fill out the form or reach out directly.
            </p>
          </div>

          {/* Quick Copy Email Box */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#111111]/50 dark:text-[#FAF7F3]/50 block">
              Direct Contact
            </span>
            <div className="flex items-center justify-between gap-2">
              <a
                href={`mailto:${bioData.email}`}
                className="font-medium text-sm sm:text-base text-[#111111] dark:text-[#FAF7F3] hover:underline"
              >
                {bioData.email}
              </a>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111111] dark:bg-[#FAF7F3] text-[#FAF7F3] dark:text-[#111111] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* 15-Minute Video Call Booking Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111111] dark:bg-white/5 border border-black/10 dark:border-white/10 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Prefer a Quick Video Sync?</span>
              </span>
              <span className="text-[11px] font-mono text-white/50">15 mins</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              International founders, engineering managers, and hiring teams can schedule a live 15-minute sync with flexible timezone overlap.
            </p>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setBookingOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-white text-[#111111] hover:bg-[#FAF7F3] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule 15-Min Intro Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Only: Direct Mailto shortcut & Profiles (Moved to below form on mobile) */}
          <div className="hidden lg:block space-y-4 pt-1">
            <a
              href={getDirectMailtoUrl()}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#FAF7F3]/70 hover:text-white transition-colors underline underline-offset-4"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Open in your default email app ({bioData.email})</span>
            </a>

            {/* Social Media Icons: LinkedIn & GitHub only */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FAF7F3]/50 block">
                Professional Profiles
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Dev JC on ${social.name}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white text-[#FAF7F3] hover:text-[#111111] text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer shadow-sm border border-white/5"
                  >
                    {getSocialIcon(social.name)}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 bg-[#111111] dark:bg-[#161616] rounded-[24px] sm:rounded-[32px] p-7 sm:p-10 shadow-2xl border border-white/5"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 flex flex-col items-center justify-center text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#FAF7F3]">
                    Inquiry Sent Successfully!
                  </h3>
                  <p className="mt-2 text-sm text-[#FAF7F3]/70 max-w-md">
                    Your inquiry details have been delivered directly to <strong className="text-white">{bioData.fullName}</strong> at{' '}
                    <span className="font-mono text-emerald-400 font-semibold">{bioData.email}</span>.
                  </p>
                </div>

                {/* Submitted summary card */}
                {submittedData && (
                  <div className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs sm:text-sm font-mono text-[#FAF7F3]/80">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-white/50">Sender:</span>
                      <span className="font-bold text-white">{submittedData.name} ({submittedData.email})</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-white/50">Service:</span>
                      <span className="text-emerald-400 font-semibold">{submittedData.projectType}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-white/50 block mb-1">Message:</span>
                      <p className="text-white/90 whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                        {submittedData.project}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsSubmitted(false);
                      setSubmittedData(null);
                    }}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-[#FAF7F3] text-[#111111] hover:bg-white transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    Send another inquiry
                  </button>

                  <a
                    href={getDirectMailtoUrl()}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                  >
                    <span>Open in Email App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                {/* Form header notice */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#FAF7F3]/70 font-semibold">
                    Inquiry Specifications
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Direct to {bioData.email}
                  </span>
                </div>

                {/* Project Category Picker (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-xs font-mono text-[#FAF7F3]/80 uppercase tracking-wider">
                      What are you looking to build? <span className="text-red-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-white/40 font-mono">Required</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          playSound('click');
                          setProjectType(type);
                          if (errors.projectType) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.projectType;
                              return next;
                            });
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          projectType === type
                            ? 'bg-white text-[#111111] font-semibold shadow-md'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.projectType && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.projectType}</span>
                    </p>
                  )}
                </div>

                {/* Name (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#FAF7F3]">
                      Name <span className="text-red-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-white/40 font-mono">Required</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-[#FAF7F3] placeholder:text-[#FAF7F3]/30 focus:outline-none transition-all text-sm ${
                      errors.name
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/40'
                        : 'border-white/10 focus:ring-2 focus:ring-[#FAF7F3]/40 focus:border-transparent'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#FAF7F3]">
                      Email <span className="text-red-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-white/40 font-mono">Required</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-[#FAF7F3] placeholder:text-[#FAF7F3]/30 focus:outline-none transition-all text-sm ${
                      errors.email
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/40'
                        : 'border-white/10 focus:ring-2 focus:ring-[#FAF7F3]/40 focus:border-transparent'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Project Description (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-[#FAF7F3]">
                      Your Project <span className="text-red-400 font-bold">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-white/40 font-mono tabular-nums">
                        {formData.project.length} chars
                      </span>
                      <span className="text-[11px] text-white/30">•</span>
                      <span className="text-[11px] text-white/40 font-mono">Required</span>
                    </div>
                  </div>

                  {/* Quick message pre-fill chips */}
                  <div className="mb-2.5">
                    <span className="text-[11px] font-mono text-white/50 block mb-1.5">
                      Quick Suggestions (click to auto-fill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTemplates.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          onClick={() => {
                            playSound('click');
                            setFormData((prev) => ({ ...prev, project: item.text }));
                            if (errors.project) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.project;
                                return next;
                              });
                            }
                            showToast(`Template loaded: ${item.label}`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all cursor-pointer active:scale-95"
                        >
                          + {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={formData.project}
                    onChange={(e) => {
                      setFormData({ ...formData, project: e.target.value });
                      if (errors.project) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.project;
                          return next;
                        });
                      }
                    }}
                    placeholder="Tell us about your project or technical challenge"
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-[#FAF7F3] placeholder:text-[#FAF7F3]/30 focus:outline-none transition-all text-sm resize-none ${
                      errors.project
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/40'
                        : 'border-white/10 focus:ring-2 focus:ring-[#FAF7F3]/40 focus:border-transparent'
                    }`}
                  />
                  {errors.project && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.project}</span>
                    </p>
                  )}
                </div>

                {/* Network / Fallback Error banner */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{submitError}</span>
                    </div>
                    <div className="pt-1">
                      <a
                        href={getDirectMailtoUrl()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-semibold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send via Email App ({bioData.email})</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-[#FAF7F3] text-[#111111] hover:bg-white font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2.5">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending to {bioData.email}...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Submit Project Inquiry</span>
                        <Send className="w-4 h-4 opacity-75" />
                      </span>
                    )}
                  </button>

                  <p className="text-[11px] font-mono text-center text-white/40 mt-2.5">
                    All inquiry details are delivered directly to the inbox of <strong className="text-white/60">{bioData.email}</strong>.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Mobile & Tablet View: Open in default email app & Professional Profiles rendered BELOW the form */}
          <div className="lg:hidden mt-8 pt-6 border-t border-white/10 space-y-4 flex flex-col items-center text-center">
            {/* Direct Mailto shortcut button */}
            <a
              href={getDirectMailtoUrl()}
              className="inline-flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white transition-colors underline underline-offset-4"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Open in your default email app ({bioData.email})</span>
            </a>

            {/* Social Media Icons: LinkedIn & GitHub only */}
            <div className="space-y-2.5 pt-1 w-full flex flex-col items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                Professional Profiles
              </span>
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Dev JC on ${social.name}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-[#FAF7F3] hover:text-[#111111] text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer shadow-sm border border-white/10"
                  >
                    {getSocialIcon(social.name)}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
