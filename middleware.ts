// ── Auth middleware — protects every route except /sign-in and /api/auth ──────
// Uses NextAuth JWT session check. Unauthenticated requests are redirected to
// the sign-in page with callbackUrl so they land where they intended after login.

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  // Protect everything except the auth routes themselves and Next.js internals
  matcher: [
    "/((?!sign-in|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
