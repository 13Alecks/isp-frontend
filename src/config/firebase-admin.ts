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
 * Try to locate the Firebase service account JSON file in the project root.
 * The file is downloaded from Firebase Console → Project Settings → Service
 * accounts → Generate new private key. It is gitignored and must never be
 * committed.
 */
function findServiceAccountFile(): string | null {
  // Check common locations — project root and src/config/.
  const candidates = [
    // Exact known filename
    "intelligent-sp-firebase-adminsdk-fbsvc-2dbb02842c.json",
    // Generic patterns
    "firebase-service-account.json",
    "service-account.json",
  ];

  for (const candidate of candidates) {
    // Try project root
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
      projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    }
    if (!clientEmail) {
      clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    }
    if (!privateKey) {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;
      if (rawKey) {
        // Normalize \n escape sequences into real newlines.
        privateKey = rawKey.includes("\n")
          ? rawKey.trim()
          : rawKey.trim().replace(/\\n/g, "\n");
      }
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
    if (!privateKey) {
      throw new Error(
        "Firebase private key not found. Set FIREBASE_PRIVATE_KEY or add a service account JSON file."
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
