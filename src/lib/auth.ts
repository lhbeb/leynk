// ─── Admin accounts ────────────────────────────────────────────────────────────
// 'admin'       → regular admin, access to dashboard only
// 'superadmin'  → full access including /admin/scripts

export type AdminRole = 'admin' | 'superadmin';

interface AdminAccount {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
}

const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: 'elmahboubimehdi@gmail.com',
    password: 'Localserver!!2',
    name: 'Admin',
    role: 'admin',
  },
  {
    email: 'matrix01mehdi@gmail.com',
    password: 'Mehbde!!2',
    name: 'SuperAdmin',
    role: 'superadmin',
  },
];

// ─── Session ───────────────────────────────────────────────────────────────────

const SESSION_KEY = 'leynk_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface SessionData {
  authenticated: boolean;
  timestamp: number;
  adminName: string;
  role: AdminRole;
}

// ─── Auth functions ────────────────────────────────────────────────────────────

/** Returns the matching account or null if credentials are wrong */
export function validateCredentials(email: string, password: string): AdminAccount | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = ADMIN_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === normalizedEmail && a.password === password
  );
  return account ?? null;
}

export function setSession(adminName: string, role: AdminRole = 'admin'): void {
  if (typeof window === 'undefined') return;
  const sessionData: SessionData = {
    authenticated: true,
    timestamp: Date.now(),
    adminName,
    role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: SessionData = JSON.parse(raw);
    if (!session.authenticated || !session.timestamp) return null;
    // Expire after 24 hours
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/** Returns true only when the logged-in user has the 'superadmin' role */
export function isSuperAdmin(): boolean {
  const session = getSession();
  return session?.role === 'superadmin';
}

export function getCurrentAdmin(): string | null {
  return getSession()?.adminName ?? null;
}

export function getCurrentRole(): AdminRole | null {
  return getSession()?.role ?? null;
}

export function getSessionRemainingTime(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return 0;
    const session: SessionData = JSON.parse(raw);
    if (!session.authenticated || !session.timestamp) return 0;
    const remaining = SESSION_DURATION - (Date.now() - session.timestamp);
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}
