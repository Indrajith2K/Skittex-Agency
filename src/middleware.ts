import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login and auth callback routes
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Check Supabase auth cookie strictly
  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("auth-token"));

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};