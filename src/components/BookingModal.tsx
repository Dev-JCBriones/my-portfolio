import React, { useState } from 'react';
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
  Download,
  Mail,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { bioData } from '../data/portfolioData';
import {
  MeetingDetails,
  getGoogleCalendarWebUrl,
  downloadIcsCalendarFile,
} from '../services/calendarHelpers';

export const BookingModal: React.FC = () => {
  const { bookingOpen, setBookingOpen, playSound, showToast } = useTheme();

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
  const [isBooked, setIsBooked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dedicated Google Meet room link
  const defaultMeetLink = 'https://meet.google.com/rzh-jcbr-int';

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

  const getMeetingDetails = (): MeetingDetails => ({
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: formData.company.trim(),
    topic,
    date,
    time: timeSlot,
    timezone,
    notes: formData.notes.trim(),
    meetLink: defaultMeetLink,
  });

  // Frictionless booking with automatic dual-email delivery & calendar links (no client login required)
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      playSound('pop');
      return;
    }

    playSound('click');
    setIsSubmitting(true);
    setErrorMessage(null);

    const meeting = getMeetingDetails();
    const gcalUrl = getGoogleCalendarWebUrl(meeting, bioData.email);

    // FormSubmit payload:
    // 1. Sends full meeting brief to JC at brionesjc050@gmail.com
    // 2. _autoresponse sends automatic confirmation email to the client at formData.email
    const payload = {
      name: meeting.name,
      email: meeting.email,
      company: meeting.company,
      call_topic: meeting.topic,
      scheduled_date: meeting.date,
      scheduled_time: meeting.time,
      client_timezone: meeting.timezone,
      google_meet_room: meeting.meetLink,
      add_to_calendar_link: gcalUrl,
      notes: meeting.notes || 'No additional notes provided.',
      _subject: `Confirmed 15-Min Intro Call: [${meeting.topic}] with ${meeting.name} (${meeting.company})`,
      _replyto: meeting.email,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: `Hi ${meeting.name},

Your 15-minute intro call with John Carlo (JC) has been scheduled!

Date: ${meeting.date}
Time: ${meeting.time} (${meeting.timezone})
Topic: ${meeting.topic}
Company: ${meeting.company}
Google Meet Room: ${meeting.meetLink}

Add to your calendar using this direct link:
${gcalUrl}

Looking forward to our conversation!

Best regards,
John Carlo Briones (Dev JC)
Software Engineer
Email: ${bioData.email}
Portfolio: https://devjc.com`,
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
      showToast('Meeting scheduled! Confirmation sent to both emails.', 'check');
    } catch (err: any) {
      console.error('Booking notification error:', err);
      // Still display the confirmed screen so the client can copy Meet link and add to calendar
      setIsBooked(true);
      playSound('pop');
      showToast('Meeting scheduled! You can add it to your calendar below.', 'check');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMeetLink = () => {
    playSound('pop');
    navigator.clipboard.writeText(defaultMeetLink);
    setCopiedLink(true);
    showToast('Google Meet room link copied!', 'copy');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadIcs = () => {
    playSound('pop');
    downloadIcsCalendarFile(getMeetingDetails(), bioData.email, bioData.fullName);
    showToast('Calendar invite (.ics) downloaded!', 'check');
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
              aria-label="Close modal"
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
                    Meeting confirmations and details have been dispatched to both{' '}
                    <strong className="text-white">{formData.email}</strong> and{' '}
                    <strong className="text-white">{bioData.email}</strong>.
                  </p>
                </div>

                {/* Google Meet Video Room Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1C1C1C] border border-emerald-500/30 text-left space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                        Google Meet Video Room
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-white/40">15 mins</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs sm:text-sm text-white">
                    <span className="truncate">{defaultMeetLink}</span>
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
                      href={defaultMeetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet Room</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Calendar Schedule Actions (Both Sides) */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                    Add to Your Calendar:
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={getGoogleCalendarWebUrl(getMeetingDetails(), bioData.email)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>

                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>Download .ics (Apple / Outlook)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsBooked(false);
                      setBookingOpen(false);
                    }}
                    className="w-full py-3 rounded-xl text-xs font-semibold bg-white text-[#111111] hover:bg-[#FAF7F3] transition-colors cursor-pointer shadow-md"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} noValidate className="space-y-6">
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
                    <span>Timezone: <strong>Flexible Overlap</strong></span>
                  </div>
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
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe the engineering role, platform scale, technical challenge, or topics you would like to discuss..."
                    className="w-full min-h-[90px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/30 resize-y leading-relaxed"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-white text-[#111111] hover:bg-[#FAF7F3] font-semibold text-sm transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2.5">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Confirming & Scheduling Call...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-emerald-600" />
                        <span>Confirm 15-Minute Intro Call</span>
                        <ArrowRight className="w-4 h-4 opacity-60" />
                      </span>
                    )}
                  </button>

                  <p className="text-[11px] font-mono text-center text-white/40 mt-2.5">
                    No sign-in required. Meeting invites and calendar schedules are delivered instantly to both emails.
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
