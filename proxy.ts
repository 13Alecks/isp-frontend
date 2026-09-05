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

/**
 * Verify a Firebase ID token via the REST API.
 * No firebase-admin SDK needed — works on Vercel serverless and local dev.
 */
async function verifyToken(idToken: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
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

  const isValid = await verifyToken(sessionCookie);

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("session");
    return res;
  }

  return NextResponse.next();
}
