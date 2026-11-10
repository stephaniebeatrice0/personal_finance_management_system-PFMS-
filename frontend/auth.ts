import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_URL } from "@/lib/config";
import { loginSchema } from "@/lib/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        let res: Response;
        try {
          res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(parsed.data),
          });
        } catch {
          throw new Error("Laravel API unreachable");
        }

        if (res.status === 401 || res.status === 422) return null; 
        if (!res.ok) throw new Error(`Login failed with status ${res.status}`);

        const body = await res.json();
        if (!body?.data || !body?.token)
          throw new Error("Unexpected login response");

        return {
          id: String(body.data.id),
          name: body.data.name,
          email: body.data.email,
          accessToken: body.token,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = Boolean(auth?.user && auth?.accessToken);
      const onAuthPage = ["/login", "/register"].some((p) =>
        nextUrl.pathname.startsWith(p),
      );
      if (onAuthPage) {
        return loggedIn
          ? Response.redirect(new URL("/dashboard", nextUrl))
          : true;
      }
      return loggedIn;
    },
    jwt({ token, user }) {
      if (user) token.accessToken = user.accessToken;
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
