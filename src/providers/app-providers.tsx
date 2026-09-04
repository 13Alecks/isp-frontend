"use client";

import * as React from "react";
import { ReactQueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </AuthProvider>
  );
}
