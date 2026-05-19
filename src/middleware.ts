import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hasSession = request.cookies
        .getAll()
        .some((cookie) =>
            cookie.name.includes("sb-")
        );

    if (
        request.nextUrl.pathname === "/" &&
        !hasSession
    ) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};