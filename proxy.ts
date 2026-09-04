import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/config/firebase-admin";

const PROTECTED_PATHS = [
  "/dashboard",
  "/students",
  "/predict",
  "/predictions",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("session");
    return res;
  }
}

export const config = {
  matcher: [
    // Run on all paths except static assets, API routes, and auth pages.
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};
