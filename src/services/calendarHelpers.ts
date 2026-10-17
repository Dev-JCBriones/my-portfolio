/**
 * Calendar Helper Utilities for Dev JC 15-Minute Intro Call
 * Generates Google Calendar web links and universal RFC-5545 .ics files
 * without requiring client OAuth login.
 */

export interface MeetingDetails {
  name: string;
  email: string;
  company: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (e.g. "14:00")
  timezone: string;
  notes?: string;
  meetLink: string;
}

export const getGoogleCalendarWebUrl = (details: MeetingDetails, hostEmail: string): string => {
  const [h, m] = details.time.split(':').map(Number);
  const startDateTime = new Date(`${details.date}T${details.time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 15 * 60 * 1000);

  const formatUtc = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dates = `${formatUtc(startDateTime)}/${formatUtc(endDateTime)}`;
  const title = encodeURIComponent(`15-Min Intro: ${details.name} (${details.company}) & JC Briones`);
  const description = encodeURIComponent(
    `🎯 Topic: ${details.topic}\n` +
    `🏢 Company: ${details.company}\n` +
    `👤 Attendees: ${details.name} (${details.email}) & John Carlo Briones (${hostEmail})\n` +
    `🌍 Client Timezone: ${details.timezone}\n` +
    `📹 Google Meet Video Room: ${details.meetLink}\n\n` +
    (details.notes ? `📝 Notes: ${details.notes}\n\n` : '') +
    `Scheduled via Dev JC Portfolio (https://devjc.com)`
  );
  const location = encodeURIComponent(details.meetLink);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${description}&location=${location}&add=${hostEmail}&add=${encodeURIComponent(details.email)}`;
};

export const downloadIcsCalendarFile = (details: MeetingDetails, hostEmail: string, hostName: string): void => {
  const startDateTime = new Date(`${details.date}T${details.time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 15 * 60 * 1000);

  const formatUtc = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStr = formatUtc(startDateTime);
  const endStr = formatUtc(endDateTime);
  const nowStr = formatUtc(new Date());
  const uid = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@devjc.portfolio`;

  const icsBody = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dev JC Portfolio//15-Min Intro Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:15-Min Intro: ${details.name} (${details.company}) & JC Briones`,
    `DESCRIPTION:Topic: ${details.topic}\\nCompany: ${details.company}\\nGoogle Meet: ${details.meetLink}\\nNotes: ${(details.notes || 'None').replace(/\n/g, '\\n')}`,
    `LOCATION:${details.meetLink}`,
    `ORGANIZER;CN=${hostName}:mailto:${hostEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${details.name}:mailto:${details.email}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${hostName}:mailto:${hostEmail}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: 15-Min Intro Call with JC Briones',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', `15min-intro-jc-${details.date}.ics`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
