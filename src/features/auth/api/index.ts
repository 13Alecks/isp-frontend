import { useMutation } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import type { LoginPayload, SignupPayload } from "@/features/auth/types";

async function login(payload: LoginPayload): Promise<User> {
  const { user } = await signInWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );
  return user;
}

async function signup(payload: SignupPayload): Promise<User> {
  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const { user } = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  );
  return user;
}

async function logout(): Promise<void> {
  await signOut(auth);
  await fetch("/api/auth/session", { method: "DELETE" });
}

/**
 * Exchange a Firebase ID token for a secure httpOnly session cookie so that
 * server-side route protection (proxy.ts) can verify auth without the client SDK.
 */
async function createSession(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error("Failed to create session");
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useCreateSession() {
  return useMutation({
    mutationFn: createSession,
  });
}
