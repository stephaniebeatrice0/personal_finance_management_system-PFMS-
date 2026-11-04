import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { API_URL } from './config';
import type { User } from './types';

// Defence in depth for protected pages:
//  1. the Auth.js session cookie must exist (the proxy already checked, but never rely on it alone)
//  2. Laravel must still accept the token (catches revoked / expired tokens)
// cache() = one Laravel call per request even if layout and page both call it.
export const requireUser = cache(async (): Promise<User> => {
  const session = await auth();
  if (!session?.user || !session.accessToken) redirect('/login');

  const res = await fetch(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${session.accessToken}`, Accept: 'application/json' },
    cache: 'no-store',
  });

  if (res.status === 401) redirect('/api/session-expired');
  if (!res.ok) throw new Error(`Could not load user (${res.status})`);
  return res.json();
});
