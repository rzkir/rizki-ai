import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJWT(token: string) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Invalid token format");
        }

        const payload = parts[1];
        const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
        const decodedPayload = atob(paddedPayload);
        return JSON.parse(decodedPayload);
    } catch {
        throw new Error("Invalid token");
    }
}

const publicPaths = [
    "/signin",
    "/signup",
    "/change-password",
    "/forgot-password",
    "/reset-password",
    "/documentation",
    "/license-agreement",
    "/privacy-policy",
    "/refund-policy",
    "/terms-of-service",
];

const adminPaths = ["/dashboard"];
const authPages = ["/signin", "/signup"];

export function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;
    const method = request.method;

    if (pathname.startsWith("/api/") || pathname === "/api") {
        return NextResponse.next();
    }

    if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
        return NextResponse.next();
    }

    if (method !== "GET") {
        return NextResponse.next();
    }

    const isPublicPath =
        pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isAuthPage = authPages.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );

    let userRole: string | null = null;
    let isAuthenticated = false;

    if (sessionCookie) {
        try {
            const decoded = decodeJWT(sessionCookie);

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                throw new Error("Token expired");
            }

            isAuthenticated = !!(decoded.sub || decoded.uid);
            userRole = (decoded.role as string) || null;
        } catch {
            const response = NextResponse.next();
            response.cookies.delete("session");
            return response;
        }
    }

    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (
        redirectParam &&
        (redirectParam === "/dashboard" ||
            redirectParam === "/" ||
            redirectParam === "/profile")
    ) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    if (isAuthenticated && isAuthPage) {
        const fromLogout = request.nextUrl.searchParams.get("logout");

        if (fromLogout) {
            return NextResponse.next();
        }

        if (userRole === "admins") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admins/") || pathname.match(/^\/[a-f0-9]{24}$/)) {
        return NextResponse.next();
    }

    if (
        pathname.startsWith("/license-agreement") ||
        pathname.startsWith("/privacy-policy") ||
        pathname.startsWith("/refund-policy") ||
        pathname.startsWith("/terms-of-service")
    ) {
        return NextResponse.next();
    }

    const isExplicitlyPublicContent =
        pathname.startsWith("/admins/") ||
        pathname.match(/^\/[a-f0-9]{24}$/) ||
        pathname.startsWith("/license-agreement") ||
        pathname.startsWith("/privacy-policy") ||
        pathname.startsWith("/refund-policy") ||
        pathname.startsWith("/terms-of-service");

    if (!isPublicPath && !isAuthenticated && !isExplicitlyPublicContent) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isAdminPath) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/signin", request.url));
        }

        if (userRole != null && userRole !== "admins") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon\\.ico).*)"],
};
