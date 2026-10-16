import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
// Gracefully load local firebase-applet-config.json if it exists, without breaking
// the build on hosting sites (e.g., Vercel) if the file is gitignored.
const configFiles = import.meta.glob('../../firebase-applet-config.json', { eager: true }) as Record<
  string,
  { default: Record<string, string> }
>;
const localFileConfig = configFiles['../../firebase-applet-config.json']?.default || {};

// Support both external hosting platform environment variables (Vercel, Netlify, etc.)
// and local AI Studio config
const resolvedConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localFileConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localFileConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localFileConfig.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localFileConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localFileConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localFileConfig.appId || '',
};

// Initialize Firebase App singleton safely
let auth: ReturnType<typeof getAuth> | null = null;
const provider = new GoogleAuthProvider();
export const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
SCOPES.forEach((scope) => provider.addScope(scope));

try {
  if (resolvedConfig.apiKey && resolvedConfig.projectId) {
    const app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApp();
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase configuration not initialized:', err);
}

// In-memory token storage (Security requirement: never in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured yet. Please configure Firebase API credentials.');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  if (auth) {
    await signOut(auth);
  }
  cachedAccessToken = null;
};

export interface CreateMeetingParams {
  name: string;
  email: string;
  company: string;
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:00"
  timezone: string;
  notes?: string;
}

export interface CalendarEventResult {
  id: string;
  htmlLink: string;
  meetLink: string;
  summary: string;
  start: string;
  end: string;
}

export const createGoogleMeetEvent = async (
  params: CreateMeetingParams,
  token: string
): Promise<CalendarEventResult> => {
  // Compute start and end ISO strings (15-minute duration)
  const [hours, minutes] = params.time.split(':').map(Number);
  const startDateTime = new Date(`${params.date}T${params.time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 15 * 60 * 1000);

  const eventPayload = {
    summary: `15-Min Intro: ${params.name} (${params.company}) & JC Briones`,
    description: [
      `🎯 Topic: ${params.topic}`,
      `🏢 Company / Team: ${params.company}`,
      `👤 Client Contact: ${params.name} (${params.email})`,
      `🌍 Timezone: ${params.timezone}`,
      params.notes ? `📝 Notes: ${params.notes}` : '',
      '',
      `Scheduled via Dev JC Portfolio (brionesjc050@gmail.com)`,
    ].filter(Boolean).join('\n'),
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila',
    },
    attendees: [
      { email: 'brionesjc050@gmail.com', displayName: 'John Carlo Briones (Dev JC)' },
      { email: params.email, displayName: params.name },
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Calendar API returned status ${response.status}`
    );
  }

  const createdEvent = await response.json();

  // Extract Google Meet link
  const meetLink =
    createdEvent.hangoutLink ||
    createdEvent.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri ||
    'https://meet.google.com';

  return {
    id: createdEvent.id,
    htmlLink: createdEvent.htmlLink,
    meetLink,
    summary: createdEvent.summary,
    start: createdEvent.start?.dateTime || startDateTime.toISOString(),
    end: createdEvent.end?.dateTime || endDateTime.toISOString(),
  };
};
