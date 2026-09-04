"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useAuth } from "@/providers";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Subtle gradient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.7 0.15 250 / 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <GraduationCap className="size-8" />
        </div>

        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Intelligent Student Platform
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Predict student performance and identify at-risk students early with
          data-driven insights.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
