import { NextRequest, NextResponse } from "next/server";

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

  // Skip non-protected paths early — no firebase-admin import needed.
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Dynamic import so firebase-admin is only loaded for protected paths.
    const { getAdminAuth } = await import("@/config/firebase-admin");
    await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("session");
    return res;
  }
}
