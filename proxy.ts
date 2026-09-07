import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";

// NOTE (Next.js 16): Middleware was renamed to Proxy. This file must live at
// the project root as `proxy.ts` (not `middleware/index.ts`) and export a
// `proxy` function, otherwise it never runs.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Check cookie presence - prevents obviously unauthorized users
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
  ],
};
