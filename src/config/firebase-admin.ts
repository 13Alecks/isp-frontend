import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminAuthInstance: Auth | null = null;

/**
 * Normalize a Firebase private key from a .env value into a valid PEM string.
 * Handles three common formats:
 *   1. Literal `\n` escape sequences (copied directly from the JSON file):
 *        "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
 *   2. Already-real newlines (some .env parsers unescape `\n` in quotes).
 *   3. Real multi-line value (wrapped in quotes across several lines).
 */
function normalizePrivateKey(raw: string | undefined): string {
  if (!raw) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set. Add it to your environment variables — see .env.example."
    );
  }

  const trimmed = raw.trim();

  // If the value already contains real newlines, use it as-is.
  if (trimmed.includes("\n")) {
    return trimmed;
  }

  // Otherwise convert literal "\n" escape sequences into real newlines.
  return trimmed.replace(/\\n/g, "\n");
}

/**
 * Lazily initialize the Firebase Admin SDK. Initialization is deferred to the
 * first call so that route handlers / proxy.ts don't trigger credential parsing
 * at build time (Next.js evaluates route modules during `next build`).
 */
export function getAdminAuth(): Auth {
  if (adminAuthInstance) {
    return adminAuthInstance;
  }

  if (!getApps().length) {
    const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error(
        "FIREBASE_CLIENT_EMAIL is not set. Add it to your environment variables — see .env.example."
      );
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error(
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set. Add it to your environment variables — see .env.example."
      );
    }

    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  adminAuthInstance = getAuth();
  return adminAuthInstance;
}
