import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const code = searchParams.get('code');

  // If Supabase redirects with a code param to any page (not already /auth/callback),
  // forward it to /auth/callback so the code gets exchanged for a session
  if (code && pathname !== '/auth/callback') {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = '/auth/callback';
    // Preserve all existing params (code, next, etc.)
    return NextResponse.redirect(callbackUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
