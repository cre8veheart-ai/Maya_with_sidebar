// ── NextAuth configuration ─────────────────────────────────────────────────
// Credentials-based auth for MAYA Beta — invite-only via environment variables.
// Users are defined in MAYA_USERS env var as JSON:
//   [{"id":"u1","name":"Alex","email":"alex@acme.com","password":"hashed"}]
// Generate a password hash with: node -e "require('bcryptjs').hash('pw',12).then(console.log)"

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export interface MayaUser {
  id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  org?: string;
  role?: string;
}

function loadUsers(): MayaUser[] {
  const raw = process.env.MAYA_USERS;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MayaUser[];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "MAYA",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = loadUsers();
        const user = users.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          org: user.org,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.org = (user as Record<string, unknown>).org as string | undefined;
        token.role = (user as Record<string, unknown>).role as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).org = token.org;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
