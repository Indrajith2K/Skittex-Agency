import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const protectedRoutes = ["/"];

    const hasSupabaseCookie = request.cookies
        .getAll()
        .some((cookie) => cookie.name.includes("auth-token"));

    if (
        protectedRoutes.includes(request.nextUrl.pathname) &&
        !hasSupabaseCookie
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};