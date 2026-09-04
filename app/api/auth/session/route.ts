import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/config/firebase-admin";

// 5 days in milliseconds — Firebase session cookies max out at 14 days.
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Missing idToken" },
        { status: 400 }
      );
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE / 1000,
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
