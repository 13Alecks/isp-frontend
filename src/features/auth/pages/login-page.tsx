"use client";

import { GraduationCap, BarChart3, Users, Brain } from "lucide-react";
import { LoginForm } from "@/features/auth/components";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track and visualize student performance metrics in real time",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description: "Identify at-risk students early with data-driven insights",
  },
  {
    icon: Users,
    title: "Student Management",
    description: "Centralized records for all your students in one place",
  },
];

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(50% 40% at 80% 10%, oklch(0.85 0.1 250) 0%, transparent 60%), radial-gradient(40% 50% at 10% 90%, oklch(0.85 0.1 250) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
            <GraduationCap className="size-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Intelligent Student Platform
          </span>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Predict student performance
              <br />
              with data-driven insights
            </h1>
            <p className="mt-3 text-base text-primary-foreground/80">
              Empower educators to identify at-risk students early and improve
              outcomes.
            </p>
          </div>

          <div className="space-y-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 backdrop-blur-sm">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-primary-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Intelligent Student Platform
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
