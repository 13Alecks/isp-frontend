"use client";

import * as React from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/config/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = React.useCallback(async () => {
    await signOut(auth);
    // Clear the server session cookie as well.
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, logout }),
    [user, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
