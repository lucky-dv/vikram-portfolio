import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Google rejects http:// redirect URIs for anything but localhost. If NEXTAUTH_URL was set
// with http:// on a real domain (or not set at all on Vercel), use the https site URL instead.
{
  const u = process.env.NEXTAUTH_URL;
  const isLocal = (s?: string) => !!s && /^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(s);
  if (u?.startsWith("http://") && !isLocal(u)) process.env.NEXTAUTH_URL = u.replace(/^http:\/\//, "https://");
  else if (!u && process.env.VERCEL && process.env.NEXT_PUBLIC_SITE_URL) process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
}

/**
 * The only accounts allowed into /admin. Hard-coded on purpose: it can't be widened
 * through environment variables, only by changing this file.
 */
export const ADMIN_EMAILS = ["vikram@datavruti.com", "lucky@datavruti.com"] as const;

export function isAdminEmail(email?: string | null) {
  return !!email && (ADMIN_EMAILS as readonly string[]).includes(email.trim().toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    // Only the two allow-listed Google accounts, and only with an email Google has verified.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const p = profile as { email?: string; email_verified?: boolean } | undefined;
      return p?.email_verified === true && isAdminEmail(p.email);
    },
    async jwt({ token }) {
      token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.isAdmin = !!token.isAdmin;
      return session;
    },
  },
};
