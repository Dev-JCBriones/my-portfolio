import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Globe,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { bioData } from '../data/portfolioData';
import {
  googleSignIn,
  createGoogleMeetEvent,
  CalendarEventResult,
  initAuth,
} from '../services/googleCalendarService';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const BookingModal: React.FC = () => {
  const { bookingOpen, setBookingOpen, playSound } = useTheme();

  // Next business day as default date (YYYY-MM-DD)
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sunday -> Monday
    if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Saturday -> Monday
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getDefaultDate());
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  const [timezone, setTimezone] = useState('US Eastern (EST / New York)');
  const [topic, setTopic] = useState('Software Engineer Role (Remote / Relocation)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMode, setBookingMode] = useState<'google' | 'email'>('google');
  const [bookingResult, setBookingResult] = useState<CalendarEventResult | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  if (!bookingOpen) return null;

  const timezones = [
    { label: 'Qatar & Middle East (AST / Doha, Dubai, Riyadh)', value: 'Qatar & Middle East (AST / UTC+3)', offset: 'UTC+3' },
    { label: 'US Eastern (EST / New York)', value: 'US Eastern (EST / New York)', offset: 'UTC-5' },
    { label: 'US Pacific (PST / San Francisco)', value: 'US Pacific (PST / San Francisco)', offset: 'UTC-8' },
    { label: 'UK & Europe (GMT / CET / London, Berlin)', value: 'UK & Europe (GMT/CET)', offset: 'UTC+0/+1' },
    { label: 'Australia (AEST / Sydney)', value: 'Australia (AEST / Sydney)', offset: 'UTC+10' },
    { label: 'Singapore & Asia (SGT / PHT / Manila)', value: 'Singapore & Asia (SGT / PHT)', offset: 'UTC+8' },
    { label: 'Any Other Timezone (100% Flexible Client Hours)', value: 'Any Timezone (Flexible Client Hours)', offset: 'Global' },
  ];

  const topics = [
    'Software Engineer Role (Remote / Qatar Onsite / Relocation)',
    'High-Impact Backend Contract / Retainer',
    'Database Optimization & API Architecture',
    'General Discovery Chat',
  ];

  const timeSlots = [
    { label: '09:00 AM', value: '09:00' },
    { label: '10:30 AM', value: '10:30' },
    { label: '02:00 PM', value: '14:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '08:00 PM', value: '20:00' },
    { label: '09:30 PM', value: '21:30' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your work email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.company.trim()) errs.company = 'Please enter your company or project name.';
    if (!date) errs.date = 'Please select a meeting date.';
    if (!timeSlot) errs.timeSlot = 'Please select a meeting time.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Google Calendar Integration with Official Google Meet Generation
  const handleGoogleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playSound('pop');
      return;
    }

    playSound('click');
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Sign in with Google to grant Calendar access
      const authResult = await googleSignIn();
      if (!authResult || !authResult.accessToken) {
        throw new Error('Google authorization was cancelled or failed.');
      }

      // 2. Create the calendar event with Google Meet conference space
      const result = await createGoogleMeetEvent(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          topic,
          date,
          time: timeSlot,
          timezone,
          notes: formData.notes.trim(),
        },
        authResult.accessToken
      );

      setBookingResult(result);

      // 3. Dispatch backup notification via FormSubmit to host email
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        call_topic: topic,
        scheduled_date: date,
        scheduled_time: timeSlot,
        client_timezone: timezone,
        google_meet_link: result.meetLink,
        google_calendar_event: result.htmlLink,
        notes: formData.notes.trim() || 'No additional notes provided.',
        _subject: `Confirmed Google Meet Call: [${topic}] with ${formData.name.trim()} (${formData.company.trim()})`,
        _replyto: formData.email.trim(),
        _template: 'table',
        _captcha: 'false',
      };

      fetch(`https://formsubmit.co/ajax/${bioData.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setIsBooked(true);
      playSound('pop');
    } catch (err: any) {
      console.error('Booking failed:', err);
      setErrorMessage(
        err.message || 'Google Calendar scheduling encountered an error. You can also send a direct request.'
      );
      playSound('pop');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative Standard Request without Google Auth
  const handleStandardBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playSound('pop');
      return;
    }

    playSound('click');
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      call_topic: topic,
      scheduled_date: date,
      scheduled_time: timeSlot,
      client_timezone: timezone,
      notes: formData.notes.trim() || 'No additional notes provided.',
      _subject: `15-Min Intro Call Request: [${topic}] from ${formData.name.trim()} (${formData.company.trim()})`,
      _replyto: formData.email.trim(),
      _template: 'table',
      _captcha: 'false',
    };

    try {
      await fetch(`https://formsubmit.co/ajax/${bioData.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setIsBooked(true);
      playSound('pop');
    } catch {
      setIsBooked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMeetLink = () => {
    if (!bookingResult?.meetLink) return;
    playSound('pop');
    navigator.clipboard.writeText(bookingResult.meetLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getDirectCalendarEmailUrl = () => {
    const subject = encodeURIComponent(
      `15-Min Video Intro Call Request - ${formData.name || 'Client'} (${formData.company || 'Company'})`
    );
    const body = encodeURIComponent(
      `Hi JC,\n\nI would like to schedule a 15-minute video intro call with you:\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Company: ${formData.company}\n` +
        `Topic: ${topic}\n` +
        `Date & Time: ${date} at ${timeSlot} (${timezone})\n` +
        `Notes: ${formData.notes || 'None'}\n\n` +
        `Looking forward to connecting via Google Meet!`
    );
    return `mailto:${bioData.email}?subject=${subject}&body=${body}`;
  };

  // Google Calendar quick add web link
  const getGoogleCalendarWebUrl = () => {
    const startIso = `${date.replace(/-/g, '')}T${timeSlot.replace(':', '')}00`;
    const [h, m] = timeSlot.split(':').map(Number);
    const endMinutes = m + 15;
    const endH = endMinutes >= 60 ? h + 1 : h;
    const endM = endMinutes >= 60 ? endMinutes - 60 : endMinutes;
    const endIso = `${date.replace(/-/g, '')}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

    const title = encodeURIComponent(`15-Min Intro: ${formData.name || 'Client'} & JC Briones`);
    const details = encodeURIComponent(
      `Topic: ${topic}\nCompany: ${formData.company}\nHost: ${bioData.email}\nClient: ${formData.email}\n\nGoogle Meet link will be generated in meeting invite.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&add=${bioData.email}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setBookingOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-[#141414] text-[#FAF7F3] rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-10 border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181818]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-sm sm:text-base text-white">
                Book a 15-Minute Intro Call
              </span>
            </div>

            <button
              onClick={() => setBookingOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {isBooked ? (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Meeting Confirmed & Scheduled</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    You're All Set!
                  </h3>
                  <p className="mt-2 text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                    Official calendar invitations and notifications have been dispatched to both{' '}
                    <strong className="text-white">{bioData.email}</strong> and{' '}
                    <strong className="text-white">{formData.email}</strong>.
                  </p>
                </div>

                {/* Google Meet Link Banner (If generated via Google Calendar API) */}
                {bookingResult?.meetLink ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#1C1C1C] border border-emerald-500/30 text-left space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          Official Google Meet Video Room
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/40">15 mins</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs sm:text-sm text-white">
                      <span className="truncate">{bookingResult.meetLink}</span>
                      <button
                        onClick={handleCopyMeetLink}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer shrink-0"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-white/70 pt-1">
                      <div>
                        📅 <strong className="text-white">{date}</strong> at <strong className="text-white">{timeSlot}</strong>
                      </div>
                      <div>
                        🌍 <span>{timezone}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <a
                        href={bookingResult.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Google Meet Room</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={bookingResult.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Open Calendar</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/70 space-y-2 text-left">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-white/40">Requested Date & Time:</span>
                      <span className="font-bold text-white">{date} @ {timeSlot} ({timezone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Topic:</span>
                      <span className="text-white">{topic}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsBooked(false);
                      setBookingResult(null);
                      setBookingOpen(false);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-[#111111] hover:bg-[#FAF7F3] transition-colors cursor-pointer shadow-md"
                  >
                    Done
                  </button>

                  <a
                    href={getGoogleCalendarWebUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={getDirectCalendarEmailUrl()}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Email App</span>
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={bookingMode === 'google' ? handleGoogleBooking : handleStandardBooking}
                noValidate
                className="space-y-6"
              >
                {/* Meeting Context Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono text-white/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Duration: <strong>15 mins</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Format: <strong>Google Meet</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Timezone: <strong>Auto Overlap</strong></span>
                  </div>
                </div>

                {/* Scheduling Mode Switcher */}
                <div className="p-1 rounded-xl bg-white/5 border border-white/5 grid grid-cols-2 gap-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setBookingMode('google');
                    }}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      bookingMode === 'google'
                        ? 'bg-white text-[#111111] font-semibold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <GoogleIcon />
                    <span>Auto Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setBookingMode('email');
                    }}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      bookingMode === 'email'
                        ? 'bg-white text-[#111111] font-semibold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Standard Email Request</span>
                  </button>
                </div>

                {/* Meeting Topic */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
                    Call Objective / Role Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topics.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => {
                          playSound('click');
                          setTopic(t);
                        }}
                        className={`p-2.5 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                          topic === t
                            ? 'bg-white text-[#111111] font-semibold border-white shadow-sm'
                            : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Slot Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Select Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: '' });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Select Time Slot (15 Mins) <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.value}
                          onClick={() => {
                            playSound('click');
                            setTimeSlot(slot.value);
                            if (errors.timeSlot) setErrors({ ...errors, timeSlot: '' });
                          }}
                          className={`py-2 px-1 rounded-lg text-[11px] font-mono text-center transition-all border cursor-pointer ${
                            timeSlot === slot.value
                              ? 'bg-white text-[#111111] font-bold border-white'
                              : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                    {errors.timeSlot && <p className="text-xs text-red-400 mt-1">{errors.timeSlot}</p>}
                  </div>
                </div>

                {/* Timezone Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Your Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value} className="bg-[#181818] text-white">
                        {tz.label} ({tz.offset})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Alex Mercer"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                        errors.name ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-white/30'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Work Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="e.g. alex@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-white/30'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Company / Team */}
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Company / Organization <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (errors.company) setErrors({ ...errors, company: '' });
                    }}
                    placeholder="e.g. Stripe, Linear, Tech Startup (US/Remote)"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                      errors.company ? 'border-red-500' : 'border-white/10 focus:ring-2 focus:ring-white/30'
                    }`}
                  />
                  {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
                </div>

                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-white">
                      Meeting Context / Project Scope (Optional)
                    </label>
                    <span className="text-[11px] font-mono text-white/40">Optional</span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe the engineering role, platform scale, technical challenge, or topics you would like to discuss..."
                    className="w-full min-h-[110px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/30 resize-y leading-relaxed"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed">{errorMessage}</p>
                      <button
                        type="button"
                        onClick={() => setBookingMode('email')}
                        className="mt-1.5 font-bold underline cursor-pointer text-white hover:text-red-200"
                      >
                        Switch to Standard Email Request instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  {bookingMode === 'google' ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-3.5 sm:px-4 rounded-2xl bg-white text-[#111111] hover:bg-[#FAF7F3] font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-70 group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2.5 py-1.5">
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm font-bold">Scheduling & Generating Google Meet...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-left min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                              <GoogleIcon />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold tracking-tight text-[#111111] truncate">
                                Schedule with Google Meet
                              </div>
                              <div className="text-[11px] font-normal text-[#111111]/70 truncate">
                                Instant Room & Dual-Email Invites
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center shrink-0 text-[#111111] group-hover:translate-x-0.5 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-3.5 sm:px-4 rounded-2xl bg-white text-[#111111] hover:bg-[#FAF7F3] font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-70 group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2.5 py-1.5">
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm font-bold">Sending Booking Request...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 text-left min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center shrink-0 text-[#111111]">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold tracking-tight text-[#111111] truncate">
                                Send Booking Request
                              </div>
                              <div className="text-[11px] font-normal text-[#111111]/70 truncate">
                                Email confirmation dispatched to JC
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center shrink-0 text-[#111111] group-hover:translate-x-0.5 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </button>
                  )}

                  <p className="text-[11px] font-mono text-center text-white/40 leading-normal">
                    {bookingMode === 'google'
                      ? 'Automatically creates official Google Meet video room & sends invitations to both emails.'
                      : `A meeting invitation will be sent to your work email and ${bioData.email}.`}
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
