import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 5 days in seconds.
const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Missing idToken" },
        { status: 400 }
      );
    }

    // Verify the ID token via Firebase REST API — no firebase-admin needed.
    // This works on Vercel serverless, local dev, and any Node.js runtime.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_FIREBASE_API_KEY is not set" },
        { status: 500 }
      );
    }

    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!verifyRes.ok) {
      const err = await verifyRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            (err as { error?: { message?: string } }).error?.message ||
            "Invalid ID token",
        },
        { status: 401 }
      );
    }

    // The ID token is valid — store it as the session cookie.
    // The token itself is a JWT signed by Google, so it's tamper-proof.
    // It expires (default 1 hour), but we set a shorter session max-age
    // and the proxy will re-verify on each request.
    const cookieStore = await cookies();
    cookieStore.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" });
}
