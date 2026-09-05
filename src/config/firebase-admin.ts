import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

let adminAuthInstance: Auth | null = null;

interface ServiceAccountJson {
  project_id?: string;
  private_key?: string;
  client_email?: string;
}

/**
 * Strip surrounding double quotes and whitespace from an env var value.
 * Vercel's UI stores the raw input — if you paste "value" with quotes,
 * the stored value includes the quote characters.
 */
function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let cleaned = value.trim();
  // Strip surrounding double or single quotes.
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || undefined;
}

/**
 * Normalize a Firebase private key into a valid PEM string.
 * Handles: literal \n escapes, real newlines, and surrounding quotes.
 */
function normalizePrivateKey(raw: string | undefined): string {
  const cleaned = cleanEnvValue(raw);
  if (!cleaned) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is not set or empty. Add it to your environment variables."
    );
  }
  // If the value already contains real newlines, use it as-is.
  if (cleaned.includes("\n")) {
    return cleaned;
  }
  // Otherwise convert literal "\n" escape sequences into real newlines.
  return cleaned.replace(/\\n/g, "\n");
}

/**
 * Try to locate the Firebase service account JSON file in the project root.
 */
function findServiceAccountFile(): string | null {
  const candidates = [
    "intelligent-sp-firebase-adminsdk-fbsvc-2dbb02842c.json",
    "firebase-service-account.json",
    "service-account.json",
  ];

  for (const candidate of candidates) {
    const rootPath = path.join(process.cwd(), candidate);
    if (fs.existsSync(rootPath)) {
      return rootPath;
    }
  }

  return null;
}

/**
 * Lazily initialize the Firebase Admin SDK. Tries the service account JSON
 * file first (local dev), then falls back to environment variables (Vercel).
 */
export function getAdminAuth(): Auth {
  if (adminAuthInstance) {
    return adminAuthInstance;
  }

  if (!getApps().length) {
    let projectId: string | undefined;
    let clientEmail: string | undefined;
    let privateKey: string | undefined;

    // 1. Try reading from the service account JSON file.
    const serviceAccountPath = findServiceAccountFile();
    if (serviceAccountPath) {
      const raw = fs.readFileSync(serviceAccountPath, "utf-8");
      const json: ServiceAccountJson = JSON.parse(raw);
      projectId = json.project_id;
      clientEmail = json.client_email;
      privateKey = json.private_key;
    }

    // 2. Fall back to environment variables (for Vercel / production).
    if (!projectId) {
      projectId = cleanEnvValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    }
    if (!clientEmail) {
      clientEmail = cleanEnvValue(process.env.FIREBASE_CLIENT_EMAIL);
    }
    if (!privateKey) {
      privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    }

    if (!projectId) {
      throw new Error(
        "Firebase project ID not found. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID or add a service account JSON file."
      );
    }
    if (!clientEmail) {
      throw new Error(
        "Firebase client email not found. Set FIREBASE_CLIENT_EMAIL or add a service account JSON file."
      );
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  adminAuthInstance = getAuth();
  return adminAuthInstance;
}
