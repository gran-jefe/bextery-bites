import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'bextery_admin_session';

// Secret key for HMAC token signing
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'bextery-secret-session-salt-2026';

// Configurable Admin Credentials
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bextery2026!';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bexterybites.com.ng';

/**
 * Validates admin credentials against configured password
 */
export function validateAdminCredentials(password: string, email?: string): boolean {
  if (!password) return false;

  const isPasswordValid = password === ADMIN_PASSWORD;
  if (!isPasswordValid) return false;

  if (email && email.trim()) {
    return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }

  return true;
}

/**
 * Creates an HMAC signed session token with expiry timestamp
 */
export function generateSessionToken(): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days valid
  const payload = `bextery_admin:${expiry}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

/**
 * Verifies if a given token string is a valid unexpired admin session
 */
export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [prefix, expiryStr, receivedHmac] = decoded.split(':');

    if (prefix !== 'bextery_admin' || !expiryStr || !receivedHmac) {
      return false;
    }

    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) {
      return false; // Expired
    }

    const payload = `bextery_admin:${expiry}`;
    const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');

    // Constant time comparison
    return crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

/**
 * Server-side check for active session in Next.js Server Components and Route Handlers
 */
export async function isAuthenticatedAdmin(request?: Request): Promise<boolean> {
  // If request is provided, try extracting cookie from headers first
  if (request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match && match[1]) {
      if (verifySessionToken(decodeURIComponent(match[1]))) {
        return true;
      }
    }
  }

  // Fallback to next/headers cookies()
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return false;
    }
    return verifySessionToken(sessionCookie.value);
  } catch {
    return false;
  }
}
