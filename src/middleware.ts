import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow login and auth callback routes
    if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    // Check Supabase auth cookie strictly
    const authCookie = request.cookies
        .getAll()
        .find((cookie) => cookie.name.includes("auth-token"));

    if (!authCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        let rawValue = authCookie.value;

        // Try decoding and parsing in case it's a JSON array/object from @supabase/ssr
        try {
            const decoded = decodeURIComponent(authCookie.value);
            const parsed = JSON.parse(decoded);
            if (Array.isArray(parsed)) {
                rawValue = parsed[0];
            } else if (parsed && typeof parsed === "object") {
                rawValue = parsed.access_token || authCookie.value;
            }
        } catch {
            // Keep raw string
        }

        // Split the JWT and decode the payload (second segment)
        const parts = rawValue.split(".");
        if (parts.length === 3) {
            const payloadBase64Url = parts[1];
            const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
            const paddedBase64 = payloadBase64 + "=".repeat((4 - (payloadBase64.length % 4)) % 4);
            
            const payloadJson = atob(paddedBase64);
            const payload = JSON.parse(payloadJson);
            const email = payload.email?.toLowerCase();

            // Strict Validation: Deny access if the email is unauthorized
            if (email !== "indrajithgamedevelouper2021@gmail.com") {
                const redirectUrl = new URL("/login", request.url);
                redirectUrl.searchParams.set("error", "unauthorized");
                return NextResponse.redirect(redirectUrl);
            }
        } else {
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