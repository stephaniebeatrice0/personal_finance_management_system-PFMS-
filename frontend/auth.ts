import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { API_URL } from '@/lib/config';
import { loginSchema } from '@/lib/validation';

// Lets the login form tell "wrong password" apart from "backend unreachable"
class ServiceUnavailable extends CredentialsSignin {
  code = 'service_unavailable';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ---------- session management ----------
  // JWT strategy: Laravel owns the users, so there is no session table to keep.
  // The session lives in an encrypted, httpOnly cookie that Auth.js sets and rotates.
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }, // 7 days
  pages: { signIn: '/login' },

  providers: [
    // ---------- authentication ----------
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // Validate again on the server: authorize() is also reachable via POST /api/auth/callback/credentials
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        let res: Response;
        try {
          res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(parsed.data),
          });
        } catch {
          throw new ServiceUnavailable();
        }

        if (res.status === 401 || res.status === 422) return null; // wrong email/password
        if (!res.ok) throw new ServiceUnavailable();

        const data = await res.json();
        return {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          accessToken: data.token,
        };
      },
    }),
  ],

  callbacks: {
    // ---------- authorization (runs in proxy.ts on every matched request) ----------
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = Boolean(auth?.user);
      const onAuthPage = ['/login', '/register'].some((p) => nextUrl.pathname.startsWith(p));

      if (onAuthPage) {
        // Signed-in users have no business on the login/register pages
        return loggedIn ? Response.redirect(new URL('/dashboard', nextUrl)) : true;
      }
      // false => Auth.js redirects to pages.signIn and appends ?callbackUrl=<original page>
      return loggedIn;
    },

    // user only exists on sign-in; copy what we need into the JWT
    jwt({ token, user }) {
      if (user) token.accessToken = user.accessToken;
      return token;
    },

    // what auth() returns in server code
    session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  events: {
    // Revoke the Laravel token whenever the user signs out
    async signOut(message) {
      const token = 'token' in message ? message.token?.accessToken : undefined;
      if (!token) return;
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      }).catch(() => undefined);
    },
  },
});
