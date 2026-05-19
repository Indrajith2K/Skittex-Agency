import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login and auth callback routes
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Find any Supabase auth or access token cookie
  const authCookie = request.cookies
    .getAll()
    .find((cookie) => cookie.name.includes("auth-token") || cookie.name.includes("access-token") || cookie.name.includes("sb-"));

  // No session
  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    let rawToken = authCookie.value;

    // Try to parse the cookie value if it is a JSON array/object (e.g. from @supabase/ssr)
    try {
      const decodedValue = decodeURIComponent(authCookie.value);
      const parsed = JSON.parse(decodedValue);
      if (Array.isArray(parsed)) {
        rawToken = parsed[0];
      } else if (parsed && typeof parsed === "object") {
        rawToken = parsed.access_token || parsed.access_token || authCookie.value;
      }
    } catch {
      // Keep rawToken as is (it's a raw JWT string)
    }

    // Split JWT and get payload (second part)
    const parts = rawToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payloadBase64Url = parts[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add base64 padding dynamically if missing
    const padLength = (4 - (payloadBase64.length % 4)) % 4;
    const paddedBase64 = payloadBase64 + "=".repeat(padLength);
    
    const jsonPayload = atob(paddedBase64);
    const payload = JSON.parse(jsonPayload);

    const email = payload.email?.toLowerCase();

    // Strict validation: only allowed email can pass through
    if (email !== "indrajithgamedevelouper2021@gmail.com") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};