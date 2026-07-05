"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ReactQueryProvider } from "@/providers/query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>
  );
}
