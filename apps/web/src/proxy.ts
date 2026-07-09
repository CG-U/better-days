import { AUTH_COOKIE_NAME } from "@better-days/shared";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PAGES = [
  "/dashboard",
  "/urges",
  "/relapses",
  "/checkins",
  "/analytics",
  "/settings",
  "/toolkit",
];

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/dashboard" : "/login", request.url),
    );
  }

  const isProtected = PROTECTED_PAGES.some((page) => pathname.startsWith(page));
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/urges/:path*",
    "/relapses/:path*",
    "/checkins/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/toolkit/:path*",
    "/login",
    "/register",
  ],
};
